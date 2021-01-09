import Web3 from 'web3';
import { Account } from 'web3-core';
import { Contract, EventData } from 'web3-eth-contract';
import { AbiItem, hexToUtf8 } from 'web3-utils';
import SootRegistryJSON from '../../abi/SootRegistry.json';
import { saveDescription } from '../scripts/saveDescription';
import { bytes32ToV0Cid, ipfsNode, v0CidToBytes32 } from '../services/IpfsService';
import reportStorage from '../services/storage/ReportStorage';
import { IPosition, IRepeatedEvent } from './../../@types/Event.types';
import { IFullIncident, IIncident, IIncidentEvent, IReport } from './../../@types/ISoot.types';
import { formatDate } from './../utils';

const GEO_RESOLUTION = 1000000;

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

  public async report(payload: IReport, account: Account, getPublickey: () => Promise<string>): Promise<void> {
    const cid = await saveDescription(account, ipfsNode, payload.description, payload.isEncrypted, getPublickey);

    return this.contract.methods
      .register(
        payload.name,
        v0CidToBytes32(cid),
        payload.isEncrypted,
        (payload.lat * GEO_RESOLUTION).toFixed(),
        (payload.lon * GEO_RESOLUTION).toFixed(),
        Date.now(),
      )
      .send({
        gas: 2500000,
      });
  }

  public async getAllIncidents(): Promise<IIncident[]> {
    const transactionresult = await this.contract.methods.getAllIncidents().call();
    const incidents: IIncident[] = [];

    const ids = transactionresult.ids;
    const names = transactionresult.names;
    const lats = transactionresult.lats;
    const lons = transactionresult.lons;
    const isEncrypteds = transactionresult.isEncrypted;

    ids.forEach((id: string, index: number) => {
      incidents.push({
        id,
        name: hexToUtf8(names[index]),
        lat: Number(lats[index]) / GEO_RESOLUTION,
        lon: Number(lons[index]) / GEO_RESOLUTION,
        isEncrypted: isEncrypteds[index],
      });
    });

    return incidents;
  }

  public async getAllRegisterEvents(startPosition: IPosition, endPosition: IPosition): Promise<IIncidentEvent[]> {
    const allRegisteredEvents = await this.contract.getPastEvents('Register', {
      fromBlock: 0,
      toBlock: 'latest',
    });

    return allRegisteredEvents
      .filter(
        (item: EventData) =>
          item.returnValues._lat > Number((startPosition.lat * GEO_RESOLUTION).toFixed()) &&
          item.returnValues._lat < Number((endPosition.lat * GEO_RESOLUTION).toFixed()) &&
          item.returnValues._lon > Number((startPosition.lng * GEO_RESOLUTION).toFixed()) &&
          item.returnValues._lon < Number((endPosition.lng * GEO_RESOLUTION).toFixed()),
      )
      .map((item) => ({
        cid: bytes32ToV0Cid(item.returnValues._cid).toString(),
        lat: item.returnValues._lat / GEO_RESOLUTION,
        lon: item.returnValues._lon / GEO_RESOLUTION,
        date: new Date(0).setUTCMilliseconds(item.returnValues._date).toString(),
        id: item.returnValues.id,
        isEncrypted: item.returnValues.isEncrypted,
        name: hexToUtf8(item.returnValues._name),
      }));
  }

  public getAllIncidentIdsForVictim(address: string): Promise<string[]> {
    return this.contract.methods.getAllReportsOfVictim(address).call();
  }

  public async getAllIncidentsForVictim(address: string): Promise<IFullIncident[]> {
    console.debug(address);

    const ids = await this.contract.methods.getAllReportsOfVictim(address).call();

    return Promise.all(ids.map((id) => this.getIncident(id)));
  }

  public async getIncident(id: number): Promise<IFullIncident> {
    const incident: IFullIncident = await this.contract.methods.getIncident(id).call();

    return {
      ...incident,
      cid: bytes32ToV0Cid(incident.cid).toString(),
      lat: incident.lat / GEO_RESOLUTION,
      lon: incident.lon / GEO_RESOLUTION,
      name: hexToUtf8(incident.name),
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
            name: hexToUtf8(event.returnValues._name),
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
