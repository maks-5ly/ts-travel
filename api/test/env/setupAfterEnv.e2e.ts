import { IntegrationTestManager } from '../integration/integratoin-test-manager';

beforeAll(async () => {
  await IntegrationTestManager.beforeAll();
});

beforeEach(async () => {
  await IntegrationTestManager.beforeEach();
  jest.clearAllMocks();
});

afterEach(async () => {
  await IntegrationTestManager.afterEach();
});
