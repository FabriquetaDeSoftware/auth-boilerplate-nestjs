import { Inject, Injectable } from '@nestjs/common';
import { IListManyProductUseCase } from '../../domain/interfaces/use_cases/list_many_products.use_case.interface';
import { IProductsRepository } from '../../domain/interfaces/repositories/products.repository.interface';
import { Products } from '../../domain/entities/products.entity';

@Injectable()
export class ListManyProductUseCase implements IListManyProductUseCase {
  @Inject('IProductsRepository')
  private readonly _productsRepository: IProductsRepository;

  public async execute(): Promise<Omit<Products, 'id'>[]> {
    const list = await this._productsRepository.listMany();

    return this.intermediry(list);
  }

  private intermediry(list: Products[]): Omit<Products, 'id'>[] {
    return this.removeIdFromProduct(list);
  }

  private removeIdFromProduct(products: Products[]): Omit<Products, 'id'>[] {
    const result = products.map(({ id, ...rest }) => rest);

    return result;
  }
}
