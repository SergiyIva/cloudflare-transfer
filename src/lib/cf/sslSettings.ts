import { cf } from "../../configs/cloudflare.ts";

export async function exportSSLSettings(zoneId: string): Promise<any> {
  try {
    return await cf.zones.settings.get("ssl", { zone_id: zoneId });
  } catch (error) {
    console.error(`Ошибка при экспорте SSL-настроек для зоны ${zoneId}:`, error);
    return null;
  }
}

export async function importSSLSettings(zoneId: string, settings: any): Promise<void> {
  if (!settings) return;
  try {
    await cf.zones.settings.edit("ssl", {
      zone_id: zoneId,
      id: "ssl",
      value: settings.value,
    });
    console.log(`SSL-настройки успешно импортированы для зоны ${zoneId}`);
  } catch (error) {
    console.error(`Ошибка при импорте SSL-настроек для зоны ${zoneId}:`, error);
  }
}