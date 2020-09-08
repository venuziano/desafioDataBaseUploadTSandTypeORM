import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactionToBeDeleted = await transactionsRepository.findOne({
      where: { id },
    });

    if (!transactionToBeDeleted) {
      throw new AppError('Transaction not found.');
    }

    await transactionsRepository.remove(transactionToBeDeleted);

    return transactionToBeDeleted;
  }
}

export default DeleteTransactionService;
