import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { RequestWithUser } from 'src/types';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: RequestWithUser) {
    return this.wishesService.create(req.user, createWishDto);
  }

  @Get('last')
  getLastWish() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  getTopWish() {
    return this.wishesService.getTopWishes();
  }

  @Get(':id')
  getWishById(@Param('id') id: number) {
    return this.wishesService.getWishById(id);
  }

  @Patch(':id')
  async updateWish(
    @Body() updateWishDto: UpdateWishDto,
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.wishesService.updateWishById(updateWishDto, id, req.user.id);
  }

  @Delete(':id')
  removeWish(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.wishesService.removeWishById(+id, req.user.id);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.wishesService.copyWish(req.user, id);
  }
}
