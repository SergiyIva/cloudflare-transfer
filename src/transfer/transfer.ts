import { type Domain, listDomains } from "../lib/cf/domainList.ts";
import { exportRuleSets, importRuleSets } from "../lib/cf/ruleLists.ts";
import { exportSSLSettings, importSSLSettings } from "../lib/cf/sslSettings.ts";
import { exportPageRules, importPageRules } from "../lib/cf/pageRules.ts";
import { exportDNSRecords, importDNSRecords } from "../lib/cf/dnsRecords.ts";
import config from "../configs/config.ts";

export async function main(domain: string, fromAccountId: string = config.DEFAULT_ACCOUNT_ID) {
  const [domains, targets] = await listDomains(fromAccountId);
  const currentDomain = domains.find((d: Domain) => d.name === domain);
  if (!currentDomain) throw new Error("Domain not found");
  const targetDomain = targets.find((d: Domain) => d.name === domain);
  if (!targetDomain) throw new Error("Target domain not found");

  const dns = await exportDNSRecords(currentDomain.id);
  // console.log(dns);
  await importDNSRecords(currentDomain.id, dns);

  const pageRules = await exportPageRules(currentDomain.id);
  // console.log(pageRules);
  await importPageRules(currentDomain.id, pageRules);

  const sslSettings = await exportSSLSettings(currentDomain.id);
  // console.log(sslSettings);
  await importSSLSettings(currentDomain.id, {
    ...sslSettings,
    value: "full"
  });

  const ruleSets = await exportRuleSets(currentDomain.id);
  // console.log(ruleSets);
  await importRuleSets(currentDomain.id, ruleSets);

  console.log("Transfer complete");
  // const zeroTrustPolicies = await exportZeroTrustConfigs(fromAccountId);
  // console.log(zeroTrustPolicies);
}