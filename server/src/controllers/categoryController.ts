import { Request, Response } from 'express';
import Category from '../models/Category';
import { asyncHandler } from '../middleware/errorHandler';

// 获取分类列表
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { parent } = req.query;
  
  const query: any = { isActive: true };
  if (parent) {
    query.parent = parent === 'null' ? null : parent;
  }
  
  const categories = await Category.find(query)
    .sort('sortOrder')
    .populate('parent', 'name');
  
  res.json({
    success: true,
    data: { categories }
  });
});

// 获取分类详情
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id)
    .populate('parent');
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }
  
  res.json({
    success: true,
    data: { category }
  });
});

// 创建分类
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.create(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Category created',
    data: { category }
  });
});

// 更新分类
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Category updated',
    data: { category }
  });
});

// 删除分类
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Category deleted'
  });
});