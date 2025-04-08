import { cf } from "../../configs/cloudflare.ts";

export async function exportPageRules(zoneId: string) {
  try {
    return await cf.pageRules.list({ zone_id: zoneId });
  } catch (error) {
    console.error(`Ошибка при экспорте Page Rules для зоны ${zoneId}:`, error);
    return [];
  }
}

export async function importPageRules(zoneId: string, rules: any[]): Promise<void> {
  for (const rule of rules) {
    try {
      await cf.pageRules.create({
        zone_id: zoneId,
        targets: rule.targets,
        actions: rule.actions,
        priority: rule.priority,
        status: rule.status,
      });
      console.log(`Правило для ${rule.targets[0].constraint.value} успешно импортировано`);
    } catch (error) {
      console.error(`Ошибка при импорте правила:`, error);
    }
  }
}