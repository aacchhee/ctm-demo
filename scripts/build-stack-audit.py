"""Reproduce source inventory and selected witnesses, then render the report.
This does not execute STACK, Maxima, or Moodle input validation.
"""
from pathlib import Path
from collections import Counter
from fractions import Fraction
from io import BytesIO
from urllib.request import urlopen
from urllib.parse import unquote,urlsplit
from zipfile import ZipFile
from html.parser import HTMLParser
import csv,hashlib,json,math,re,shutil,subprocess,tarfile
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"_stack-audit"
SHA="33383047af39c204bf4442802a058f8b918b2b1b"
URL=f"https://codeload.github.com/maths/moodle-qtype_stack/zip/{SHA}"
def text(q,p):
 e=q.find(p)
 return "".join(e.itertext()).strip() if e is not None else ""
def inventory():
 data=SRC/"data";data.mkdir(exist_ok=True)
 with urlopen(URL,timeout=180) as response:archive=response.read()
 files={}
 with ZipFile(BytesIO(archive)) as z:
  for entry in z.infolist():
   if not entry.is_dir():
    p=entry.filename.split("/",1)[1]
    if p.startswith("samplequestions/") and p.endswith((".xml",".mbz")):files[p]=z.read(entry)
 records=[];backups=[];manifest=[];questions={}
 for p,b in sorted(files.items()):
  digest=hashlib.sha256(b).hexdigest()
  manifest.append(dict(path=p,bytes=len(b),sha256=digest))
  if p.endswith(".xml"):
   for ordinal,q in enumerate(ET.fromstring(b).findall("question"),1):
    if q.get("type")=="category":continue
    kind=q.get("type","unknown")
    review="static source screen; candidate details in report"
    if kind!="stack":review="content-summary screen; no native grading or figure validation"
    if "/HELM/" in p:review="structural and compact-content screen; candidates checked in full source"
    records.append(dict(source_sha=SHA,path=p,ordinal=ordinal,name=text(q,"name/text"),type=kind,file_sha256=digest,review=review,native_stack_run="not run"))
    questions.setdefault(p,[]).append(q)
  else:
   with tarfile.open(fileobj=BytesIO(b),mode="r:*") as tar:
    for member in tar.getmembers():
     if member.name.lstrip("./")!="questions.xml":continue
     doc=ET.fromstring(tar.extractfile(member).read())
     for ordinal,q in enumerate(doc.findall(".//question"),1):
      kind=q.findtext("qtype",q.get("type","unknown"))
      backups.append(dict(source_sha=SHA,archive=p,member=member.name,ordinal=ordinal,question_id=q.get("id",""),name=q.findtext("name",""),type=kind,review="legacy compact screen or core duplicate; see archive method" if kind=="stack" else "inventory only; not exhaustively reviewed",native_stack_run="not run"))
 assert len(records)==3895,len(records)
 assert sum(r["type"]=="stack" for r in records)==2599
 assert len(backups)==753,len(backups)
 assert sum(r["type"]=="stack" for r in backups)==682
 with (data/"coverage.csv").open("w",newline="",encoding="utf8") as f:
  w=csv.DictWriter(f,fieldnames=list(records[0]));w.writeheader();w.writerows(records)
 (data/"archive-coverage.json").write_text(json.dumps(backups,ensure_ascii=False,indent=2),encoding="utf8")
 (data/"source-manifest.json").write_text(json.dumps(dict(repository="maths/moodle-qtype_stack",commit=SHA,archive_url=URL,archive_sha256=hashlib.sha256(archive).hexdigest(),files=manifest),ensure_ascii=False,indent=2),encoding="utf8")
 counts=Counter(("/".join(r["path"].split("/")[2:3]) if "/stacklibrary/" in r["path"] else "Demos/import examples") for r in records)
 stack_counts=Counter(("/".join(r["path"].split("/")[2:3]) if "/stacklibrary/" in r["path"] else "Demos/import examples") for r in records if r["type"]=="stack")
 table="| Collection | Records | STACK records |\n|---|---:|---:|\n"
 for group,n in sorted(counts.items()):table+=f"| {group} | {n} | {stack_counts[group]} |\n"
 (SRC/"_scope-table.md").write_text(table,encoding="utf8")
 return questions
def witnesses(questions):
 checks=[];traces=[]
 def trace(suffix,name,truths):
  paths=[p for p in questions if p.endswith("/"+suffix)];assert len(paths)==1
  q=questions[paths[0]][0]
  prt=next(p for p in q.findall("prt") if p.findtext("name")==name)
  ns={n.findtext("name"):n for n in prt.findall("node")}
  dest={n.findtext(b+"nextnode") for n in ns.values() for b in ("true","false")}
  roots=set(ns)-dest;assert len(roots)==1
  current=roots.pop();score=Fraction(0);steps=[]
  while current!="-1":
   n=ns[current];truth=truths[current];b="true" if truth else "false"
   mode=n.findtext(b+"scoremode");v=Fraction(n.findtext(b+"score"))
   score=v if mode=="=" else score+v if mode=="+" else score-v
   steps.append(dict(node=current,truth=truth,mode=mode,value=str(v),score=str(score)))
   current=n.findtext(b+"nextnode");assert len(steps)<=len(ns)
  assert score==1
  traces.append(dict(path=paths[0],prt=name,score=str(score),steps=steps))
 trace("Matrix_varmatrix.xml","prt1",{"0":True,"1":True,"2":True,"3":False})
 trace("Free-text_with_regex.xml","prt5",{"0":True,"3":False})
 trace("AlgMap-14-4.xml","prt1",{"0":False,"1":True})
 for x in (1,2,3):assert 2*(x+2)**2-7-(2*(x-2)**2-7)==16*x
 checks.append(dict(id="AR-02",result="Correct minus keyed completed square =16*x at x=1,2,3"))
 for t in (0,1,2):assert -4*6+4*(2+6*t)==-16+24*t
 checks.append(dict(id="TOP-02",result="Tangent-line normalized ODE residual -16+24*t; n2=2, initial data 2,6"))
 assert 8*1**2+2!=2*(1**2+1)
 checks.append(dict(id="GEN-03",result="Model equality compares 10 with 4 at n=1"))
 assert round(math.sin(math.radians(1.9)),4)==0.0332
 checks.append(dict(id="HE1-01",result="sin(1.9 degrees) rounds to 0.0332, not 0.5000"))
 assert Fraction(1,4)+Fraction(1,2)==Fraction(3,4)
 assert Fraction(1,4)*Fraction(1,2)==Fraction(1,8)
 checks.append(dict(id="HE1-02",result="Exponents add to 3/4; multiplying them gives wrong 1/8"))
 assert (2/2)**2==1 and 2**2==4
 checks.append(dict(id="ARC-01",result="Diameter 2 gives area pi; radius 2 gives 4*pi"))
 result=dict(source_sha=SHA,method="Independent arithmetic and XML score-field traces with supplied node truths. No Maxima answer tests or input validation executed.",checks=checks,score_traces=traces)
 (SRC/"data/witnesses.json").write_text(json.dumps(result,indent=2),encoding="utf8")
 return result
def export_findings():
 findings=[]
 for p in sorted((SRC/"sections").glob("*.md")):
  md=p.read_text(encoding="utf8")
  matches=list(re.finditer(r"(?m)^###\s+([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+)\b([^\n]*)",md))
  for i,m in enumerate(matches):
   body=md[m.end():matches[i+1].start() if i+1<len(matches) else len(md)].strip()
   findings.append(dict(id=m.group(1),title=re.sub(r"\s*\{#[^}]+\}","",m.group(2)).strip(" :—-"),section=p.name,markdown=body))
 assert findings
 ids=[f["id"] for f in findings];assert len(ids)==len(set(ids)),"Duplicate finding IDs"
 (SRC/"data/findings.json").write_text(json.dumps(dict(source_sha=SHA,findings=findings),ensure_ascii=False,indent=2),encoding="utf8")
 table="| ID | Finding | Section |\n|---|---|---|\n"
 for f in findings:
  title=f["title"].replace("|",r"\|")
  table+=f"| [{f['id']}](#{f['id'].lower()}) | {title} | {f['section'].replace('.md','')} |\n"
 (SRC/"_finding-index.md").write_text(table,encoding="utf8")
 return findings
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set()
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if "id" in d:self.ids.add(d["id"])
  if tag=="a" and "href" in d:self.links.append(d["href"])
def verify():
 out=SRC/"_site";p=Links();p.feed((out/"index.html").read_text(encoding="utf8"))
 errors=[];source_links=0
 manifest=json.loads((SRC/"data/source-manifest.json").read_text(encoding="utf8"))
 paths={f["path"] for f in manifest["files"]}
 for href in p.links:
  u=urlsplit(href)
  prefix=f"/maths/moodle-qtype_stack/blob/{SHA}/"
  if u.netloc=="github.com" and u.path.startswith(prefix):
   source_path=unquote(u.path[len(prefix):])
   if source_path.startswith("samplequestions/"):
    source_links+=1
    if source_path not in paths:errors.append(href)
  if u.scheme or u.netloc:continue
  if not u.path:
   if u.fragment and unquote(u.fragment) not in p.ids:errors.append(href)
  elif not (out/unquote(u.path)).is_file():errors.append(href)
 assert not errors,errors
 return dict(html_bytes=(out/"index.html").stat().st_size,local_link_errors=errors,validated_question_source_links=source_links)
def main():
 q=inventory();w=witnesses(q);f=export_findings()
 subprocess.run(["quarto","render","-M",f"audit_findings:{len(f)}"],cwd=SRC,check=True)
 out=SRC/"_site";shutil.copytree(SRC/"data",out/"data",dirs_exist_ok=True)
 result=verify();result.update(source_sha=SHA,findings=len(f),standalone_records=3895,stack_records=2599,backup_records=753,arithmetic_checks=len(w["checks"]),xml_score_traces=len(w["score_traces"]),native_stack_runs=0)
 (out/"data/build-validation.json").write_text(json.dumps(result,indent=2),encoding="utf8")
 target=ROOT/"_site"/"stack-audit"
 if target.exists():shutil.rmtree(target)
 shutil.copytree(out,target);print(json.dumps(result,indent=2))
if __name__=="__main__":main()

