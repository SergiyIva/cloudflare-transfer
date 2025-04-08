import { type Domain, listDomains } from "../lib/cf/domainList.ts";
import { exportRuleSets, importRuleSets } from "../lib/cf/ruleLists.ts";
import config from "../configs/config.ts";
import { exportDNSRecords, importDNSRecords } from "../lib/cf/dnsRecords.ts";
import { exportPageRules, importPageRules } from "../lib/cf/pageRules.ts";
import { exportSSLSettings, importSSLSettings } from "../lib/cf/sslSettings.ts";

export async function main(domain: string, fromAccountId: string = config.DEFAULT_ACCOUNT_ID) {
  const [domains, targets] = await listDomains(fromAccountId);
  const currentDomain = domains.find((d: Domain) => d.name === domain);
  if (!currentDomain) throw new Error("Domain not found");
  const targetDomain = targets.find((d: Domain) => d.name === domain);
  if (!targetDomain) throw new Error("Target domain not found");

  const dns = await exportDNSRecords(currentDomain.id);
  // console.log(dns); 
  await importDNSRecords(targetDomain.id, dns);

  const pageRules = await exportPageRules(currentDomain.id);
  // console.log(pageRules);
  await importPageRules(targetDomain.id, pageRules);

  const sslSettings = await exportSSLSettings(currentDomain.id);
  // console.log(sslSettings);
  await importSSLSettings(targetDomain.id, {
    ...sslSettings,
    value: "full"
  });

  const ruleSets = await exportRuleSets(currentDomain.id);
  // console.log(ruleSets.map(r => r.rules));
  await importRuleSets(targetDomain.id, ruleSets);

  console.log("Transfer complete");
  // const zeroTrustPolicies = await exportZeroTrustConfigs(fromAccountId);
  // console.log(zeroTrustPolicies);
}