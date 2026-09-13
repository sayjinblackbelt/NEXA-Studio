const assert = require('node:assert/strict');
const { migrate } = require('../js/migration-v1.js');

const legacy = {
  clients:[{id:'c1',name:'Cliente A',status:'ACTIVE'},{id:'c2',name:'Cliente B',status:'LEAD'}],
  projects:[{id:'p1',name:'ORBITA',type:'Identidade visual',stage:'Diagnóstico',status:'ACTIVE',client:'c1'}],
  portfolio:[{id:'o1',name:'ORBITA',type:'Identidade',featured:true}],
  qa:{p1:{strategy:true,visual:true,functional:true,technical:true,license:true,delivery:true}}
};

const result = migrate(legacy, {now:new Date('2026-01-01T00:00:00.000Z')});
assert.equal(result.version, 'canonical-v1');
assert.equal(result.clients.length, 2);
assert.equal(result.projects.length, 1);
assert.equal(result.projects[0].clientId, 'client-c1');
assert.equal(result.projects[0].stage, 'DIAGNOSIS');
assert.equal(result.qaResults[0].overallStatus, 'PASSED');
assert.equal(result.portfolioCases[0].publicationStatus, 'DRAFT');

assert.throws(() => migrate({clients:[{id:'c1',name:'A'}],projects:[{id:'p1',name:'P',client:'missing'}]}), /references missing client/);
assert.throws(() => migrate({clients:[],projects:[{id:'p1',name:'P',client:'c1'}]}), /references missing client/);

console.log('PASS: migration-v1 canonical mapping and integrity checks');
