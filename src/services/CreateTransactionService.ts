import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Categories from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Categories);

    const balance = transactionsRepository.getBalance();

    if (type === 'outcome' && (await balance).total < value) {
      throw new AppError(
        `No founds to withdraw. Founds avaiable ${(await balance).total}`,
      );
    }

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExists) {
      const createdCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(createdCategory);

      const transaction = transactionsRepository.create({
        title,
        type,
        value,
        category_id: createdCategory.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: checkCategoryExists.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
