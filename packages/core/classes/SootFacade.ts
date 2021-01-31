import Web3 from 'web3';
import { Account } from 'web3-core';
import { Contract, EventData } from 'web3-eth-contract';
import { AbiItem, sha3 } from 'web3-utils';
import { IRepeatedEvent } from '@interfaces/Event.types';
import { ILocation } from '@interfaces/IPosition';
import { IDBIncident, IFullIncident, IIncidentEvent, IReport } from '@interfaces/ISoot.types';
import { saveDescription } from '@scripts/saveDescription';
import { ipfsNode } from '@services/IpfsService';
import reportStorage from '@services/storage/ReportStorage';
import SootRegistryJSON from '@soot/contracts/build/contracts/SootRegistry.json';
import { decreaseLocationResolution, formatDate, increaseLocationResolution } from '../utils';
import { DBInstance } from '../services/orbitDB';

export const GEO_RESOLUTION = 1000000;

class SootRegistryFacade {
  public contract!: Contract;

  private readonly web3: Web3;
  private readonly account: Account;

  constructor(web3: Web3, _account: Account, contractAddress: string) {
    this.web3 = web3;
    this.account = _account;
    this.contract = this.contractInstance(_account.address, contractAddress);
  }

  private contractInstance(account: string, contractAddress: string): Contract {
    return new this.web3.eth.Contract(SootRegistryJSON.abi as AbiItem[], contractAddress, {
      from: account,
    });
  }

  public async report(payload: IReport, account: Account, encryptionPublicKey: string): Promise<void> {
    const cid = await saveDescription(ipfsNode, payload.description, payload.isEncrypted, encryptionPublicKey);

    const tokenId = await this.contract.methods.getNextTokenId().call();

    if (!DBInstance) {
      throw 'Orbit db is not initialized';
    }

    const name = sha3(payload.name) || '';

    DBInstance.put({
      id: tokenId,
      name,
      author: account.address,
      description: payload.description,
      latitude: increaseLocationResolution(payload.latitude),
      longitude: increaseLocationResolution(payload.longitude),
      date: Date.now(),
    });

    const estimateGas = await this.contract.methods
    .register(
      tokenId,
      name,
      cid.toString(),
      payload.isEncrypted,
      increaseLocationResolution(payload.latitude),
      increaseLocationResolution(payload.longitude),
      Date.now(),
    )
    .estimateGas({ gas: 2500000});

    return this.contract.methods
      .register(
        tokenId,
        name,
        cid.toString(),
        payload.isEncrypted,
        increaseLocationResolution(payload.latitude),
        increaseLocationResolution(payload.longitude),
        Date.now(),
      )
      .send({
        gas: estimateGas + 1,
      });
  }

  public async getAllRegisterEvents(startPosition: ILocation, endPosition: ILocation): Promise<IIncidentEvent[]> {
    const allRegisteredEvents = await this.contract.getPastEvents('Register', {
      fromBlock: 0,
      toBlock: 'latest',
    });

    return allRegisteredEvents
      .filter(
        (item: EventData) =>
          item.returnValues._latitude > increaseLocationResolution(startPosition.latitude) &&
          item.returnValues._latitude < increaseLocationResolution(endPosition.latitude) &&
          item.returnValues._longitude > increaseLocationResolution(startPosition.longitude) &&
          item.returnValues._longitude < increaseLocationResolution(endPosition.longitude),
      )
      .map((item) => ({
        cid: item.returnValues._cid,
        latitude: decreaseLocationResolution(item.returnValues._latitude),
        longitude: decreaseLocationResolution(item.returnValues._longitude),
        date: new Date(0).setUTCMilliseconds(item.returnValues._date).toString(),
        id: item.returnValues.id,
        isEncrypted: item.returnValues.isEncrypted,
        name: item.returnValues._name,
      }));
  }

  public async getAllIncidentIdsForVictim(): Promise<string[]> {
    return this.contract.methods.getAllReports().call();
  }

  public async getAllIncidentsForVictim(): Promise<IFullIncident[]> {
    const ids: number[] = await this.contract.methods.getAllReports().call();

    return Promise.all(ids.map((id: number) => this.getIncident(id)));
  }

  public async getIncident(id: number): Promise<IFullIncident> {
    const incident: IFullIncident = await this.contract.methods.getIncident(id).call();

    return {
      ...incident,
      cid: incident.cid,
      latitude: decreaseLocationResolution(incident.latitude),
      longitude: decreaseLocationResolution(incident.longitude),
      name: incident.name,
      date: formatDate(Number(incident.date)),
    };
  }

  public async getAllRepeatedEvents(): Promise<IRepeatedEvent[]> {
    const allRepeatedAttaks = await this.contract.getPastEvents('RepeatedAttack', {
      fromBlock: 0,
      toBlock: 'latest',
    });

    return Promise.all(
      allRepeatedAttaks
        .map(
          (event: EventData): IRepeatedEvent => ({
            author: event.returnValues._author,
            name: event.returnValues._name,
            date: formatDate(event.returnValues._date),
          }),
        )
        .filter((event: IRepeatedEvent) => !this.isTheAuthor(event.author) && this.hasAHistoryEvent(event.name)),
    );
  }
  private hasAHistoryEvent(name: string): Promise<boolean> {
    return reportStorage.isInReports(name);
  }
  private isTheAuthor(author: string): boolean {
    return author === this.account.address;
  }
}

export default SootRegistryFacade;
