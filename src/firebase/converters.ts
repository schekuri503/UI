import type { FirestoreConverter, Match, Prediction } from '../types'

export const matchConverter: FirestoreConverter<Match> = {
  toFirestore: (value) => ({ ...value }),
  fromFirestore: (value) => value as unknown as Match,
}

export const predictionConverter: FirestoreConverter<Prediction> = {
  toFirestore: (value) => ({ ...value }),
  fromFirestore: (value) => value as unknown as Prediction,
}
