import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IProductsOrchestrator } from '../../domain/interfaces/orchestrators/products.orchestrator.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { TypeProductEnum } from '../enum/type_product.enum';
import { ICreateSubscriptionProductUseCase } from '../../domain/interfaces/use_cases/create_subscription_product.use_case.interface';
import { Products } from '../../domain/entities/products.entity';
import { ICreateSingleProductUseCase } from '../../domain/interfaces/use_cases/create_single_product.use_case.interface';
import { ListManyProductsWithoutIdReturn } from '../../domain/types/list_many_products_return.type';
import { ListManyProductsDto } from '../dto/list_many_products.dto';
import { IListManySubscriptionProductUseCase } from '../../domain/interfaces/use_cases/list_many_subscription_products.use_case.interface';
import { IListManySingleProductUseCase } from '../../domain/interfaces/use_cases/list_many_single_products.use_case.interface';
import { IDeleteSubscriptionProductUseCase } from '../../domain/interfaces/use_cases/delete_subscription_product.use_case';
import { DeleteProductDto } from '../dto/delete_product.dto';

@Injectable()
export class ProductsOrchestrator implements IProductsOrchestrator {
  @Inject('ICreateSubscriptionProductUseCase')
  private readonly _createSubscriptionProductUseCase: ICreateSubscriptionProductUseCase;

  @Inject('ICreateSingleProductUseCase')
  private readonly _createSingleProductUseCase: ICreateSingleProductUseCase;

  @Inject('IListManySubscriptionProductUseCase')
  private readonly _listManySubscriptionProductUseCase: IListManySubscriptionProductUseCase;

  @Inject('IListManySingleProductUseCase')
  private readonly _listManySingleProductUseCase: IListManySingleProductUseCase;

  @Inject('IDeleteSubscriptionProductUseCase')
  private readonly _deleteSubscriptionProductUseCase: IDeleteSubscriptionProductUseCase;

  public async create(
    role: string,
    input: CreateProductDto,
    type: TypeProductEnum,
  ): Promise<Products> {
    if (type === TypeProductEnum.SINGLE) {
      return await this._createSingleProductUseCase.execute(role, input);
    }

    if (type === TypeProductEnum.SUBSCRIPTION) {
      return await this._createSubscriptionProductUseCase.execute(role, input);
    }

    throw new BadRequestException(`Invalid product type: ${type}`);
  }

  public async delete(role: string, input: DeleteProductDto): Promise<void> {
    if (input.type === TypeProductEnum.SINGLE) {
      return;
    }

    if (input.type === TypeProductEnum.SUBSCRIPTION) {
      return await this._deleteSubscriptionProductUseCase.execute(
        role,
        input.public_id,
      );
    }

    throw new BadRequestException(`Invalid product type: ${input.type}`);
  }

  public async listMany(
    input: ListManyProductsDto,
    type: TypeProductEnum,
  ): Promise<ListManyProductsWithoutIdReturn> {
    if (type === TypeProductEnum.SINGLE) {
      return this._listManySingleProductUseCase.execute(input);
    }

    if (type === TypeProductEnum.SUBSCRIPTION) {
      return await this._listManySubscriptionProductUseCase.execute(input);
    }

    throw new BadRequestException(`Invalid product type: ${type}`);
  }
}
