import sql from "sql-template-strings"
import { ClientBase } from "pg"
import { pool } from "../utilities/database"

export enum FeedItemKind {
    PersonalBest = 1,
    CompletionStreak = 2,
    JoinWorkout = 3,
    MissedWorkout = 4
}

type PersonalBestFeedItem = {
    kind: FeedItemKind.PersonalBest,
    extra_data: {
        exercise: {
            id: number,
            name: string
        },
        weight: number
    }
}

type CompletionStreakFeedItem = {
    kind: FeedItemKind.CompletionStreak,
    extra_data: {
        streak: number,
    }
}

type JoinWorkoutFeedItem = {
    kind: FeedItemKind.JoinWorkout,
    extra_data: {
        workout: {
            id: number,
            name: string
        },
    }
}

type MissedWorkoutFeedItem = {
    kind: FeedItemKind.MissedWorkout,
    extra_data: {
        workout: {
            id: number,
            name: string
        },
    }
}

type FeedData = PersonalBestFeedItem
            | CompletionStreakFeedItem
            | JoinWorkoutFeedItem
            | MissedWorkoutFeedItem;

type FeedItem = FeedData & {athlete_id: number};
type FeedRow = FeedItem & { id: number, created: Date, likes: number }
type FeedResult = FeedData & { id: number, created: Date, likes: number, athlete_id: number, first_name: string, last_name: string };

export default class FeedModel {
    client?: ClientBase

    constructor(client?: ClientBase) {
        this.client = client
    }

    async createOne(item: FeedItem) {
        try {
            await (this.client || pool).query(sql`
                INSERT INTO feed (athlete_id, kind, extra_data)
                VALUES (${item.athlete_id}, ${item.kind}, ${item.extra_data})
                RETURNING id;
            `)
        } catch (err) {
            throw new Error(`models:feed:createOne: ${err.message}`)
        }
    }

    async likeOne(itemId: number) {
        try {
            await (this.client || pool).query(sql`
            UPDATE feed 
                SET likes = likes + 1
            WHERE id = ${itemId}
            `)
        } catch (err) {
            throw new Error(`models:feed:likeOne: ${err.message}`)
        }
    }

    async readAll(pageIndex = 0, pageSize = 25): Promise<FeedResult[]> {
        try {
            const offset = pageIndex * pageSize
            const result = await (this.client || pool).query(sql`
                SELECT
                    feed.id,
                    feed.created,
                    feed.athlete_id,
                    users.first_name,
                    users.last_name,
                    feed.kind,
                    feed.likes,
                    feed.extra_data
                FROM feed
                INNER JOIN users
                    ON users.id = athlete_id
                ORDER BY created DESC
                OFFSET ${offset} ROWS
                FETCH NEXT ${pageSize} ROWS ONLY;
            `)

            return result.rows 
        } catch (error) {
            throw new Error("models:exercise:all: invalid query")
        }
    }
}