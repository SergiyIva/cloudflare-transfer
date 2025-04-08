import { readFile, writeFile } from "fs/promises";
import { cf } from "../../configs/cloudflare.ts";

export type Domain = {
  id: string
  name: string
}

export async function listDomains(fromAccountId: string): Promise<Domain[][]> {
  try {
    let dataDomains: Domain[] = [];
    let dataTargets: Domain[] = [];
    try {
      const cachedDomainsData = await readFile("domains.json", "utf8");
      const cachedTargetsData = await readFile("targets.json", "utf8");
      dataDomains = JSON.parse(cachedDomainsData);
      dataTargets = JSON.parse(cachedTargetsData);
    } catch (e) {

    }
    if (!dataDomains.length || !dataTargets.length) {
      console.log("Get domains from API...");
      for await (const zone of cf.zones.list()) {
        if (zone.account.id === fromAccountId)
          dataDomains.push({
            id: zone.id,
            name: zone.name
          });
        else
          dataTargets.push({
            id: zone.id,
            name: zone.name
          });
      }
    }
    await writeFile("domains.json", JSON.stringify(dataDomains));
    await writeFile("targets.json", JSON.stringify(dataTargets));

    return [dataDomains, dataTargets];
  } catch (error) {
    console.error('Ошибка при получении списка доменов:', error);
    return [];
  }
}