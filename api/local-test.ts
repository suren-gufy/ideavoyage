import handler from './index';

// Mock Vercel req/res
class MockRes {
  statusCode = 200;
  headers: Record<string,string> = {};
  body: any;
  setHeader(k:string,v:string){ this.headers[k]=v; }
  status(code:number){ this.statusCode = code; return this; }
  json(obj:any){ this.body = obj; console.log('RESPONSE', this.statusCode, JSON.stringify(obj,null,2)); return this; }
  end(){ console.log('END', this.statusCode); }
}

(async () => {
  const req: any = { method: 'POST', url: '/api/analyze', body: { idea: 'AI fitness coach that personalizes workouts using computer vision', industry: 'Fitness', targetAudience: 'busy professionals'} };
  const res: any = new MockRes();
  await handler(req, res);
})();
