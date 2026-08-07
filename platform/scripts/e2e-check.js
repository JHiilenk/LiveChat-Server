(async function(){
  try{
    const base = 'http://127.0.0.1:4001';
    console.log('Base URL:', base);

    const loginRes = await fetch(base + '/api/v1/client/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantCode: 'DEWI', userName: 'dewi', password: 'admin123' })
    });
    const loginData = await loginRes.json().catch(()=>({}));
    console.log('loginStatus', loginRes.status, 'ok=', !!loginData.ok);

    const tenantRes = await fetch(base + '/api/v1/tenants/DEWI');
    const tenantData = await tenantRes.json().catch(()=>({}));
    const tenant = tenantData?.tenant || {};
    const widgetId = tenant.widgetId || '';
    console.log('tenant', tenant.tenantCode || 'N/A', 'widgetId=', widgetId);

    const payload = {
      tenantCode: 'DEWI',
      widgetId,
      widgetNumber: tenant.widgetNumber || 1,
      visitorName: 'AssistantGuest',
      message: 'Tes langsung dari assistant (E2E check)',
      sourceUrl: 'http://localhost/demo?tenantCode=DEWI'
    };

    const sendRes = await fetch(base + '/api/v1/inbox/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const sendData = await sendRes.json().catch(()=>({}));
    console.log('sendStatus', sendRes.status, JSON.stringify(sendData));

    const token = loginData?.session?.token || '';
    const inboxUrl = base + `/api/v1/client/inbox?tenantCode=DEWI&widgetId=${encodeURIComponent(widgetId)}&limit=10`;
    const inboxRes = await fetch(inboxUrl, { headers: { 'X-Platform-Session': token } });
    const inboxData = await inboxRes.json().catch(()=>({}));
    console.log('inboxFetchUrl', inboxUrl);
    console.log('inboxStatus', inboxRes.status, JSON.stringify(inboxData));

    process.exit(0);
  }catch(err){
    console.error('E2E error', err);
    process.exit(1);
  }
})();
