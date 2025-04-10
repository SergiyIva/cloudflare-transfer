import { cf } from "../../configs/cloudflare.ts";

const phases = ["http_config_settings", "http_request_transform", "http_request_cache_settings"];

export async function exportRuleSets(zoneId: string) {
  try {
    const rules = [];
    for await (const ruleLists of cf.rulesets.list({ zone_id: zoneId })) {
      if (phases.includes(ruleLists.phase)) {
        const ruleList = await cf.rulesets.get(ruleLists.id, { zone_id: zoneId });
        ruleList.rules = ruleList.rules.map((rule: Record<string, any>) => {
          delete rule.id;
          delete rule.version;
          delete rule.last_updated;
          delete rule.ref;

          return rule as any;
        });
        rules.push(ruleList);
      }
    }
    return rules;
  } catch (error) {
    console.error(`Ошибка при экспорте Rule Lists для зоны ${zoneId}:`, error);
    return [];
  }
}

export async function importRuleSets(zoneId: string, rules: any[]) {
  for (const rule of rules) {
    try {
      await cf.rulesets.create({
        zone_id: zoneId,
        name: rule.name,
        kind: rule.kind,
        description: rule.description,
        phase: rule.phase,
        rules: rule.rules.map((r: Record<string, any>) => {
          delete r.public_id;

          return r;
        }),
      });
      console.log(`Правило ${rule.name} успешно импортировано`);
    } catch (error) {
      console.error(`Ошибка при импорте Правила ${rule.name}:`, error);
    }
  }
}