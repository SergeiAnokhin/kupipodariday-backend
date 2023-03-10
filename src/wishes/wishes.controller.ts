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

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  getLastWish() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  getTopWish() {
    return this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: RequestWithUser) {
    return this.wishesService.create(req.user, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishById(@Param('id') id: number) {
    return this.wishesService.getWishById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Body() updateWishDto: UpdateWishDto,
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.wishesService.updateWishById(updateWishDto, id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeWish(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.wishesService.removeWishById(+id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.wishesService.copyWish(req.user, id);
  }
}
