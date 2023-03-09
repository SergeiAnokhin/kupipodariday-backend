import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types';
import { Wishlists } from './entities/wishlist.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createWishListDto: CreateWishlistDto,
    @Req() req: RequestWithUser,
  ) {
    return this.wishlistsService.createWishlist(req.user, createWishListDto);
  }

  @Get()
  getWishlists() {
    return this.wishlistsService.getWishlists();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishlistsById(@Param('id') id: string) {
    return this.wishlistsService.getWishlistsById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlistlists(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.wishlistsService.updateWishlist(
      +id,
      updateWishlistDto,
      req.user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishlist(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wishlists> {
    return await this.wishlistsService.removeWishlistById(id, req.user.id);
  }
}
