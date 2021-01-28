import { IDBIncident } from '@interfaces/ISoot.types';
import OrbitDB from 'orbit-db';
import DocumentStore from 'orbit-db-docstore';
import { ipfsNode } from './IpfsService';

let orbitDBInstance: OrbitDB;
let DBInstance: DocumentStore<IDBIncident>;

async function createInstance(): Promise<OrbitDB> {
  orbitDBInstance = await OrbitDB.createInstance(ipfsNode);

  return orbitDBInstance;
}

async function connect(instanceAddress: string): Promise<DocumentStore<IDBIncident>> {
  DBInstance = await orbitDBInstance.docs(instanceAddress, {
    accessController: {
      write: ['*'],
    },
    indexBy: 'id',
  } as any);

  return DBInstance;
}

export { orbitDBInstance, DBInstance, createInstance, connect };
