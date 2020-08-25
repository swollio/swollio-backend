import sql from "sql-template-strings"
import { ClientBase } from "pg"
import Team from "../schema/team"

export interface TeamRow {
    id: number
    pin: number
    name: string
    coach_id: number
    sport: string
}

export default class TeamModel {
    client: ClientBase

    constructor(client: ClientBase) {
        this.client = client
    }

    async createOne(team: Team): Promise<Team> {
        try {
            const result = await this.client.query(sql`
                INSERT INTO teams (pin, name, coach_id, sport)
                VALUES (${team.pin}, ${team.name}, ${team.coach.id}, ${team.sport})
                RETURNING id;
            `)

            return {
                id: result.rows[0].id,
                ...team,
            }
        } catch (err) {
            throw new Error(`models:team:createOne: ${err.message}`)
        }
    }

    async readOne(id: number): Promise<Team> {
        try {
            const result = await this.client.query(sql`
                SELECT
                    id, pin, name, sport,
                    (SELECT ROW_TO_JSON(_coach) FROM 
                        (SELECT id, first_name, last_name, email FROM users WHERE users.id = coach_id) as _coach
                    ) as coach
                FROM teams
                WHERE teams.id=${id}
            `)

            return result.rows[0]
        } catch (err) {
            throw new Error(`models:team:createOne: ${err.message}`)
        }
    }

    async updateOne(
        id: number,
        team: {
            pin?: number
            name?: string
            sport?: string
        }
    ): Promise<void> {
        try {
            await this.client.query(sql`
                UPDATE teams
                SET
                    pin = COALESCE(${team.pin}, pin),
                    name = COALESCE(${team.name}, name),
                    sport = COALESCE(${team.sport}, sport)
                WHERE id = ${id}
            `)
        } catch (err) {
            throw new Error(`models:team:updateOne: ${err.message}`)
        }
    }

    async destroyOne(id: number): Promise<void> {
        try {
            await this.client.query(sql`
                DELETE FROM teams
                WHERE id=${id}
            `)
        } catch (err) {
            throw new Error(`models:team:destroyOne: ${err.message}`)
        }
    }
}
