import { cf } from "../../configs/cloudflare.ts";

export async function exportZeroTrustConfigs(accountId: string) {
  try {
    const response = await cf.zeroTrust.access.policies.list({
      account_id: accountId,
    });
    return response.result;
  } catch (error) {
    console.error('Ошибка при экспорте Zero Trust конфигураций:', error);
    return [];
  }
}

// Функция для импорта конфигураций Zero Trust (пример для Access policies)
export async function importZeroTrustConfigs(configs: any[]): Promise<void> {
  for (const config of configs) {
    try {
      await cf.zeroTrust.access.policies.create({
        account_id: "1234",
        name: config.name,
        decision: config.decision,
        include: config.include,
        exclude: config.exclude,
        require: config.require,
      });
      console.log(`Zero Trust политика ${config.name} успешно импортирована`);
    } catch (error) {
      console.error(`Ошибка при импорте Zero Trust политики ${config.name}:`, error);
    }
  }
}