// Teste de integração: execute com Node.js 22, com o Compose iniciado.
import assert from 'node:assert/strict';

const api = process.env.TEST_API_URL || 'http://localhost:3000';
const front = process.env.TEST_FRONT_URL || 'http://localhost:8080';
async function request(path, method = 'GET', body, expected = 200) {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  assert.equal(response.status, expected, `${method} ${path}: ${text}`);
  return text ? JSON.parse(text) : undefined;
}

let id;
try {
  const created = await request('/vehicles', 'POST', { plate: ' abc1d23 ', model: 'Toyota Corolla', year: 2022, mileage: 45000 }, 201);
  id = created.id;
  assert.equal(created.plate, 'ABC1D23');
  assert.equal(created.year, 2022);
  assert.equal(created.mileage, 45000);
  assert.deepEqual(Object.keys(created).sort(), ['id', 'mileage', 'model', 'plate', 'year']);
  assert.equal((await request(`/vehicles/${id}`)).model, 'Toyota Corolla');
  assert.ok((await request('/vehicles')).some(vehicle => vehicle.id === id));
  const updated = await request(`/vehicles/${id}`, 'PATCH', { mileage: 46000 });
  assert.equal(updated.mileage, 46000);
  assert.equal(updated.model, 'Toyota Corolla');
  assert.equal(updated.plate, 'ABC1D23');
  assert.equal(updated.year, 2022);
  const valid = { plate: 'ABC1D23', model: 'Toyota Corolla', year: 2022, mileage: 45000 };
  for (const body of [
    { ...valid, plate: '   ' }, { ...valid, model: '   ' },
    { ...valid, plate: 'A'.repeat(11) }, { ...valid, model: 'A'.repeat(121) },
    { ...valid, year: 1885 }, { ...valid, year: 10000 }, { ...valid, year: 2022.5 },
    { ...valid, mileage: -1 }, { ...valid, mileage: 1.5 },
    { ...valid, mileage: 2147483648 }, { ...valid, mileage: '10' },
    { ...valid, extra: true }, { plate: 'ABC1D23' },
  ]) await request('/vehicles', 'POST', body, 400);
  for (const field of ['plate', 'model', 'year', 'mileage']) {
    await request('/vehicles', 'POST', { ...valid, [field]: null }, 400);
    await request(`/vehicles/${id}`, 'PATCH', { [field]: null }, 400);
  }
  await request('/vehicles/abc', 'GET', undefined, 400);
  const proxied = await fetch(`${front}/api/vehicles`);
  assert.equal(proxied.status, 200);
  assert.ok((await proxied.json()).some(vehicle => vehicle.id === id));
  const html = await fetch(front);
  assert.equal(html.status, 200);
  assert.match(await html.text(), /<div id="root"><\/div>/);
  const swagger = await fetch(`${api}/docs`);
  assert.equal(swagger.status, 200);
  const schema = await request('/docs-json');
  assert.ok(schema.paths['/vehicles'].post);
  assert.ok(schema.paths['/vehicles/{id}'].patch);
  await request(`/vehicles/${id}`, 'DELETE', undefined, 204);
  await request(`/vehicles/${id}`, 'GET', undefined, 404);
  await request(`/vehicles/${id}`, 'PATCH', { mileage: 1 }, 404);
  await request(`/vehicles/${id}`, 'DELETE', undefined, 404);
  id = undefined;
  console.log('OK: CRUD, validações, 404, Swagger, HTML e proxy interno do front.');
} finally {
  if (id !== undefined) await request(`/vehicles/${id}`, 'DELETE', undefined, 204);
}
