import { createProdMockServer } from 'vite-plugin-mock/client'
import mock from '../mock/index'

export async function setupProdMockServer() {
  const mockModules = [...mock]
  createProdMockServer(mockModules)
}
