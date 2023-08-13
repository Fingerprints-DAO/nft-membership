import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export enum PageState {
  Soon = 'Soon',
  Released = 'Released',
  PreAuction = 'PreAuction',
  Auction = 'Auction',
  Migration = 'Migration',
}

const EST = 'America/New_York'
const currentDate = dayjs().tz(EST)

const stageDates: Record<PageState, dayjs.Dayjs | undefined> = {
  [PageState.Soon]: dayjs.tz('2023-08-10 22:00:00', EST),
  [PageState.Released]: dayjs.tz('2023-08-14 22:00:00', EST),
  [PageState.PreAuction]: dayjs.tz('2023-08-15 10:00:00', EST),
  [PageState.Auction]: dayjs.tz('2023-08-16 10:00:00', EST),
  [PageState.Migration]: undefined,
}

const getStageFromEnv = (): PageState | undefined => {
  return process.env.NEXT_PUBLIC_STAGE as PageState
}

const getCurrentStage = (): PageState => {
  for (let stage of Object.values(PageState)) {
    if (currentDate.isBefore(stageDates[stage])) {
      return stage
    }
  }
  return PageState.Migration
}

export const getEffectiveStage = (): PageState => {
  return getStageFromEnv() || getCurrentStage()
}

const compareStages = (current: PageState, target: PageState): number => {
  return Object.values(PageState).indexOf(current) - Object.values(PageState).indexOf(target)
}

export const isBeforeStage = (targetStage: PageState): boolean => {
  return compareStages(getEffectiveStage(), targetStage) < 0
}

export const isAfterStage = (targetStage: PageState): boolean => {
  return compareStages(getEffectiveStage(), targetStage) > 0
}
