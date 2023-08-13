import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export enum PageState {
  Soon, // off
  Released, // till PageState.PreAuction. Which is 14th Aug 10pm
  PreAuction, // from 14th Aug 10pm to 15th Aug 10am EST
  Auction, // from 15th Aug 10am to 16th Aug 10am EST
  Migration, // from 16th Aug 10am to forever EST
}

const EST = 'America/New_York'
const currentDate = dayjs().tz(EST)
const releasedDate = dayjs.tz('2023-08-14 22:00', EST)
const preAuctionDate = dayjs.tz('2023-08-15 10:00', EST)
const auctionDate = dayjs.tz('2023-08-16 10:00', EST)
const migrationDate = dayjs.tz('2023-08-17 10:00', EST)

export const getCurrentStage = (): PageState => {
  // if (currentDate.isBefore(releasedDate)) return PageState.Soon
  if (currentDate.isBefore(preAuctionDate)) return PageState.Released
  if (currentDate.isBefore(auctionDate)) return PageState.PreAuction
  if (currentDate.isBefore(migrationDate)) return PageState.Auction
  return PageState.Migration
}

export const isBeforeReleased = (): boolean => currentDate.isBefore(releasedDate)
export const isAfterReleased = (): boolean => currentDate.isAfter(releasedDate)

export const isBeforePreAuction = (): boolean => currentDate.isBefore(preAuctionDate)
export const isAfterPreAuction = (): boolean => currentDate.isAfter(preAuctionDate)

export const isBeforeAuction = (): boolean => currentDate.isBefore(auctionDate)
export const isAfterAuction = (): boolean => currentDate.isAfter(auctionDate)

export const isBeforeMigration = (): boolean => currentDate.isBefore(migrationDate)
export const isAfterMigration = (): boolean => currentDate.isAfter(migrationDate)
