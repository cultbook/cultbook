import * as Yup from "yup"

export const AddFollowerSchema = Yup.object().shape({
  follower: Yup.string().url()
})
