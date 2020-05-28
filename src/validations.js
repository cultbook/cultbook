import * as Yup from "yup"

export const AddMemberSchema = Yup.object().shape({
  member: Yup.string().url()
})

export const CultSchema = Yup.object().shape({
  name: Yup.string().min(6).max(66),
  description: Yup.string().min(1).max(666)
})

export const RitualSchema = Yup.object().shape({
  name: Yup.string().min(1).max(66),
  description: Yup.string().min(1).max(666)
})

export const RuleSchema = Yup.object().shape({
  name: Yup.string().min(1).max(66),
  description: Yup.string().min(1).max(666)
})

export const GatheringSchema = Yup.object().shape({
  name: Yup.string().min(1).max(66),
  description: Yup.string().min(1).max(666),
  location: Yup.string().min(1).max(666)
})

export const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(1).max(66),
})

export const EmailSchema = Yup.object().shape({
  email: Yup.string().email(),
})

export const ReportSchema = Yup.object().shape({
  message: Yup.string().min(1),
})
