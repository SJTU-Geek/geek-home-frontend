/**
 * 产品 / 项目相关后端 API 封装。
 *
 * 数据原先写死在 src/data/products.ts，现由后端 contributors.Product 管理，
 * 这里保持与原前端 Product 接口一致的形状。
 */

export type ProductStatus = '已发布' | '测试中' | '开发中' | '策划中';

export interface Product {
  /** 编号（后端 slug，前端原来叫 id） */
  id: string;
  /** 中文名称 */
  name: string;
  /** 英文 / 副标题（可选，用于装饰） */
  subtitle?: string | null;
  /** 状态 */
  status: ProductStatus;
  /** 产品地址 */
  url?: string | null;
  /** 一句话简介，用于卡片展示 */
  tagline: string;
  /** 完整介绍（可多段） */
  description: string[];
  /** 核心特色 */
  features: { title: string; detail: string }[];
  /** 主图 / 多张图，第一张作为封面 */
  images: string[];
  /** 开发者，留空则展示占位符 */
  developers: string[];
  /** 主题强调色（hex），用于卡片细节 */
  accent: string;
  /** 标签关键词 */
  tags: string[];
  /** 排序，数字越小越靠前 */
  order: number;
  /** 是否在首页「核心项目成果」展示 */
  featured: boolean;
}

/** 开放 API 统一响应结构（见后端 openapi/api_response.py） */
interface Envelope<T> {
  success: boolean;
  code: number;
  data: T;
  error_code: string | null;
  message: string;
}

interface ProductsData {
  count: number;
  products: Product[];
}

export type FetchProductsResult =
  | { kind: 'ok'; products: Product[] }
  | { kind: 'error'; message: string };

export async function fetchProducts(): Promise<FetchProductsResult> {
  try {
    const resp = await fetch('/api/products/', {
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) {
      return { kind: 'error', message: `HTTP ${resp.status}` };
    }
    const envelope = (await resp.json()) as Envelope<ProductsData>;
    if (!envelope.success || !envelope.data) {
      return { kind: 'error', message: envelope.message || `code ${envelope.code}` };
    }
    return { kind: 'ok', products: envelope.data.products };
  } catch (err) {
    return { kind: 'error', message: (err as Error).message };
  }
}
