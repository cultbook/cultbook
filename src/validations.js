import * as Yup from "yup"

export const AddFollowerSchema = Yup.object().shape({
  follower: Yup.string().url()
})

export const CultSchema = Yup.object().shape({
  name: Yup.string().min(1).max(66),
  description: Yup.string().min(1).max(666)
})

export const RitualSchema = Yup.object().shape({
  name: Yup.string().min(1).max(66),
  description: Yup.string().min(1).max(666)
})
