import * as Yup from "yup"

export const AddFollowerSchema = Yup.object().shape({
  follower: Yup.string().url()
})

export const SetCultNameSchema = Yup.object().shape({
  name: Yup.string().min(1).max(66)
})
