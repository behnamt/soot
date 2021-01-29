import storage from './AppStorage.service';
import LocalStorage from './LocalStorage';

interface IReportStorage {
  count: number;
  items: string[];
}

class ReportStorage {
  public storage: LocalStorage;

  private readonly allMyReportsKey = 'myReports';

  constructor() {
    this.storage = storage;
  }

  public async getAllReports(): Promise<string[]> {
    const storedData: IReportStorage = await this.storage.getItem(this.allMyReportsKey);

    return storedData.items;
  }

  public async isReportStorageEmpty(): Promise<boolean> {
    const isKeyAvailable = await this.isReportKeyAvailable();

    if (!isKeyAvailable) {
      return true;
    }
    const storedData: IReportStorage = await this.storage.getItem(this.allMyReportsKey);

    return storedData.count === 0;
  }

  public async addReports(report: string | string[]): Promise<void> {
    // TODO: do not add duplicate item
    const storedData: IReportStorage = await this.storage.getItem(this.allMyReportsKey);
    const content = !Array.isArray(report) ? [report] : report;
    storedData.count += 1;
    storedData.items = storedData.items.concat(content);
    this.storage.setItem(this.allMyReportsKey, storedData);
  }

  public async setReports(reports: string[]): Promise<void> {
    const duplicatesRemoved = reports.filter((item, index, self) => self.indexOf(item) === index);
    const count = duplicatesRemoved.length;
    this.storage.setItem(this.allMyReportsKey, { count, items: duplicatesRemoved });
  }

  public async isInReports(name: string): Promise<boolean> {
    const allEvents = await this.getAllReports();

    return allEvents.some((item) => item === name);
  }

  private async createEmptyReportsStorage(): Promise<void> {
    this.storage.setItem(this.allMyReportsKey, {
      count: 0,
      items: [],
    });
  }

  private async isReportKeyAvailable(): Promise<boolean> {
    try {
      const storedData = await this.storage.getItem(this.allMyReportsKey);

      if (!storedData) {
        throw new Error();
      }

      return true;
    } catch {
      await this.createEmptyReportsStorage();

      return false;
    }
  }
}

const reportStorage = new ReportStorage();

export default reportStorage;
