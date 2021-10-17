import { Migration } from '@mikro-orm/migrations';

export class Migration20211011120442 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "visited_location" ("id" serial primary key, "user_id" int4 not null, "location_id" int4 not null);');

    this.addSql('create table "location" ("id" serial primary key, "name" varchar(255) not null);');
    this.addSql('alter table "location" add constraint "location_name_unique" unique ("name");');

    this.addSql('create table "user" ("user_id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "email" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "photograph" ("id" serial primary key, "user_user_id" int4 not null);');

    this.addSql('create table "photograph_locations" ("photograph_id" int4 not null, "location_id" int4 not null);');
    this.addSql('alter table "photograph_locations" add constraint "photograph_locations_pkey" primary key ("photograph_id", "location_id");');

    this.addSql('alter table "photograph" add constraint "photograph_user_user_id_foreign" foreign key ("user_user_id") references "user" ("user_id") on update cascade;');

    this.addSql('alter table "photograph_locations" add constraint "photograph_locations_photograph_id_foreign" foreign key ("photograph_id") references "photograph" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "photograph_locations" add constraint "photograph_locations_location_id_foreign" foreign key ("location_id") references "location" ("id") on update cascade on delete cascade;');
  }

}
