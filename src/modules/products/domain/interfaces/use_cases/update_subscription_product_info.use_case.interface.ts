import { UpadateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';
import { Products } from '../../entities/products.entity';

export interface IUpdateSubscriptionProductInfoUseCase {
  execute(
    role: string,
    public_id: string,
    input: UpadateProductInfoDto,
  ): Promise<Products>;
}
