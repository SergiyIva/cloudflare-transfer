import { cf } from "../../configs/cloudflare.ts";

export async function exportDNSRecords(zoneId: string) {
  try {
    const response = await cf.dns.records.list({ zone_id: zoneId });
    return response.result;
  } catch (error) {
    console.error(`Ошибка при экспорте DNS-записей для зоны ${zoneId}:`, error);
    return [];
  }
}

export async function importDNSRecords(zoneId: string, records: any[]) {
  for (const record of records) {
    try {
      await cf.dns.records.create({
        zone_id: zoneId,
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        proxied: record.proxiable,
        comment: record.comment,
        tags: record.tags
      });
      console.log(`DNS-запись ${record.name} успешно импортирована`);
    } catch (error) {
      console.error(`Ошибка при импорте DNS-записи ${record.name}:`, error);
    }
  }
}