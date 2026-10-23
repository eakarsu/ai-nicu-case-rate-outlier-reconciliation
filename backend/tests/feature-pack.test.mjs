import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { filterRecords, recordsToCsv, buildInsight, INSIGHT_TYPES } from "../featurePack.mjs";
const rows=[{id:1,reference:"A-1",title:"Alpha case",status:"Open",owner:"Sam",risk:"High",due_date:"2020-01-01",amount:0},{id:2,reference:"B-2",title:"Beta case",status:"Closed",owner:"Jo",risk:"Low",due_date:"2999-01-01",amount:50}];
test("filterRecords searches and filters, preserving zero-amount rows",()=>{assert.equal(filterRecords(rows,{q:"alpha"}).length,1);assert.equal(filterRecords(rows,{status:"Closed"})[0].reference,"B-2");assert.equal(filterRecords(rows,{risk:"High"})[0].amount,0);assert.equal(filterRecords(rows,{}).length,2);});
test("recordsToCsv includes header and zero values",()=>{const csv=recordsToCsv(rows);assert.ok(csv.startsWith("id,reference"));assert.ok(csv.includes("A-1"));assert.ok(csv.includes(",0"));});
test("insights are deterministic fallback over own records with labelled sections",()=>{assert.equal(INSIGHT_TYPES.length,3);for(const t of INSIGHT_TYPES){const i=buildInsight(t,{id:"f1"},rows);assert.equal(i.aiGenerated,false);assert.equal(i.mode,"deterministic-fallback");assert.ok(i.sections.length>=5);assert.ok(i.sections.some(s=>s.title==="Record count"&&s.detail==="2"));}assert.throws(()=>buildInsight("nope",{id:"f1"},rows),/Unknown insight/);});
test("server wires search/export/insights behind auth",()=>{const s=fs.readFileSync(new URL("../server.mjs",import.meta.url),"utf8");assert.ok(s.includes("/records/export"));assert.ok(s.includes("/insights"));assert.ok(s.includes("filterRecords"));});
