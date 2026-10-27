import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const topics=['Nätverksteknik','IT-infrastruktur','Windows Server','DNS och DHCP','IT-säkerhet'];
const fallback=[
['Vilket OSI-lager hanterar IP-adresser?',['Fysiska lagret','Nätverkslagret','Transportlagret','Applikationslagret'],1,'IP-routing sker på lager 3, nätverkslagret.','Nätverksteknik'],
['Vad gör DHCP?',['Krypterar trafik','Tilldelar IP-inställningar automatiskt','Översätter domännamn','Blockerar portar'],1,'DHCP delar ut bland annat IP-adress, nätmask och gateway.','DNS och DHCP'],
['Vilken port använder HTTPS normalt?',['21','53','80','443'],3,'HTTPS använder normalt TCP-port 443.','IT-säkerhet'],
['Vad är en VLAN-trunk?',['Port som bara bär ett VLAN','Port som kan bära flera VLAN','Trådlös anslutning','Brandväggsregel'],1,'En trunk kan transportera trafik för flera VLAN med exempelvis 802.1Q.','Nätverksteknik'],
['Vad används DNS främst till?',['Översätta domännamn till IP-adresser','Dela ut MAC-adresser','Kryptera hårddiskar','Starta virtuella maskiner'],0,'DNS gör det möjligt att slå upp IP-adresser för domännamn.','DNS och DHCP'],
['Vad är Hyper-V?',['Ett antivirus','En hypervisor för virtuella maskiner','En DNS-server','Ett nätverksprotokoll'],1,'Hyper-V används för att skapa och köra virtuella maskiner.','IT-infrastruktur'],
['Vad används Active Directory Domain Services till?',['Central hantering av användare och datorer','Videoredigering','Diskdefragmentering','Paketsniffning'],0,'AD DS tillhandahåller katalogtjänster och domänautentisering.','Windows Server'],
['Vilket protokoll är anslutningsorienterat?',['UDP','ICMP','TCP','ARP'],2,'TCP upprättar en anslutning och erbjuder ordnad leverans.','Nätverksteknik'],
['Vad gör NAT i en router?',['Översätter nätverksadresser','Skapar lösenord','Installerar operativsystem','Lagrar DNS-zoner'],0,'NAT översätter IP-adresser mellan nätverk.','Nätverksteknik'],
['Vad är principen om minsta privilegium?',['Alla får administratörsrättigheter','Ge endast nödvändiga behörigheter','Stäng av all loggning','Använd samma lösenord överallt'],1,'Användare och tjänster ska bara ha de rättigheter de behöver.','IT-säkerhet'],
['Vad gör en standard-gateway?',['Vidarebefordrar trafik till andra nät','Skapar lokala filer','Byter MAC-adress på datorn','Tilldelar domännamn'],0,'En gateway används för att nå nätverk utanför det lokala subnätet.','Nätverksteknik'],
['Vad betyder RAID 1?',['Striping utan redundans','Spegling av data','Molnbackup','Kryptering av diskar'],1,'RAID 1 speglar data mellan diskar men ersätter inte säkerhetskopiering.','IT-infrastruktur'],
['Vilket kommando testar vanligtvis nåbarhet via ICMP?',['ping','mkdir','format','whoami'],0,'Ping skickar normalt ICMP Echo Request och mäter svar.','Nätverksteknik'],
['Vad är en gruppolicy (GPO)?',['Regler för central Windows-konfiguration','En fysisk nätverkskabel','En diskpartition','En brandväggstillverkare'],0,'GPO används för att centralt hantera inställningar i Windows-miljöer.','Windows Server'],
['Vad är tvåfaktorsautentisering?',['Två användarnamn','Två oberoende autentiseringsfaktorer','Två webbläsare','Två IP-adresser'],1,'MFA med två faktorer kombinerar exempelvis lösenord och autentiseringsapp.','IT-säkerhet']
];
function localQuestions(topic,count){let arr=fallback.filter(q=>topic==='Alla ämnen'||q[4]===topic);if(!arr.length)arr=fallback;return Array.from({length:Math.min(count,20)},(_,i)=>{const q=arr[i%arr.length];return {question:q[0],options:q[1],answer:q[2],explanation:q[3]}})}
const server=http.createServer(async(req,res)=>{
 if(req.method==='POST'&&req.url==='/api/questions'){
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>12000){res.writeHead(413);res.end();return}}
  let body;try{body=JSON.parse(raw)}catch{res.writeHead(400);res.end('Ogiltig JSON');return}
  const topic=topics.includes(body.topic)?body.topic:'Alla ämnen';const count=Math.max(1,Math.min(20,Number(body.count)||5));
  const key=process.env.OPENAI_API_KEY;
  if(!key){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({source:'demo',questions:localQuestions(topic,count)}));return}
  try{
   const prompt=`Skapa ${count} unika, faktakontrollerade flervalsfrågor på svenska om ${topic}, nivå ${['Lätt','Medel','Svår'].includes(body.level)?body.level:'Medel'}. Returnera ENDAST JSON: {"questions":[{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"..."}]}. answer ska vara heltal 0-3. Fyra rimliga alternativ. Inga dubbletter.`;
   const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.7,response_format:{type:'json_object'},messages:[{role:'user',content:prompt}]})});
   if(!r.ok)throw new Error('AI-tjänsten kunde inte svara');const data=await r.json();const parsed=JSON.parse(data.choices[0].message.content);const qs=parsed.questions?.filter(q=>typeof q.question==='string'&&Array.isArray(q.options)&&q.options.length===4&&q.options.every(o=>typeof o==='string')&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4&&typeof q.explanation==='string').slice(0,count);
   if(!qs?.length)throw new Error('Ogiltiga AI-frågor');res.setHeader('Content-Type','application/json');res.end(JSON.stringify({source:'ai',questions:qs}));
  }catch(e){res.writeHead(502,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'AI-frågorna kunde inte skapas. Försök igen eller starta utan API-nyckel.'}))}return;
 }
 if(req.method!=='GET'||!['/','/index.html'].includes(req.url)){res.writeHead(404);res.end('Not found');return}
 const html=await readFile(path.join(root,'index.html'));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);
});
server.listen(process.env.PORT||3000,()=>console.log('AI Study Pro: http://localhost:'+(process.env.PORT||3000)));
