import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private readonly contactModel: Model<ContactDocument>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const contact = await this.contactModel.create(createContactDto);
    this.realtimeService.publish('contacts', 'created', `New inquiry from ${contact.name}`);
    return contact;
  }

  findAll() {
    return this.contactModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async remove(id: string) {
    const contact = await this.contactModel.findByIdAndDelete(id).lean().exec();

    if (!contact) throw new NotFoundException('Contact inquiry not found');

    this.realtimeService.publish('contacts', 'deleted', `Inquiry deleted: ${contact.subject}`);

    return { message: 'Contact inquiry deleted successfully' };
  }
}
