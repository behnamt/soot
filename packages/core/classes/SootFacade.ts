import Web3 from 'web3';
import { Account } from 'web3-core';
import { Contract, EventData } from 'web3-eth-contract';
import { AbiItem, sha3 } from 'web3-utils';
import { IRepeatedEvent } from '@interfaces/Event.types';
import { ILocation } from '@interfaces/IPosition';
import { IDBIncident, IFormattedDBIncident, IFullIncident, IReport } from '@interfaces/ISoot.types';
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
    const tokenId = await this.contract.methods.getNextTokenId().call();

    if (!DBInstance) {
      throw 'Orbit db is not initialized';
    }

    const name = sha3(payload.name) || '';

    const hash = await DBInstance.put({
      id: tokenId,
      name,
      author: account.address,
      description: payload.description,
      latitude: payload.latitude,
      longitude: payload.longitude,
      date: Date.now(),
    });

    const estimateGas = await this.contract.methods
      .register(
        tokenId,
        name,
        hash,
        payload.isEncrypted,
      )
      .estimateGas({ gas: 2500000 });

    return this.contract.methods
      .register(
        tokenId,
        name,
        hash,
        payload.isEncrypted,
      )
      .send({
        gas: estimateGas + 1,
      });
  }

  public async getAllRegisterEvents(startPosition: ILocation, endPosition: ILocation): Promise<IFormattedDBIncident[]> {
    if (!DBInstance) {
      throw 'Orbit db is not initialized';
    }

    const allRegisteredEvents = await DBInstance.query((
      doc => doc.latitude > startPosition.latitude &&
        doc.latitude < endPosition.latitude &&
        doc.longitude > startPosition.longitude &&
        doc.longitude < endPosition.longitude));

    return allRegisteredEvents
      .map((item) => ({
        ...item,
        latitude: item.latitude,
        longitude: item.longitude,
        date: new Date(0).setUTCMilliseconds(item.date).toString(),
      }));
  }

  public async getAllIncidentIdsForVictim(): Promise<string[]> {
    return this.contract.methods.getAllReports().call();
  }

  public async getAllIncidentsForVictim(): Promise<IDBIncident[]> {
    const ids: string[] = await this.contract.methods.getAllReports().call();

    if (!DBInstance) {
      throw 'Orbit db is not initialized';
    }

    return DBInstance.query((doc) => ids.includes(doc.id))
  }

  public async getIncident(id: number): Promise<IFormattedDBIncident | null> {
    if (!DBInstance) {
      throw 'Orbit db is not initialized';
    }

    const incident = await DBInstance.get(id);
    if (incident?.length) {
      return {
        ...incident[0],
        latitude: incident[0].latitude,
        longitude: incident[0].longitude,
        date: formatDate(Number(incident[0].date)),
      };
    }
    return null;
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
