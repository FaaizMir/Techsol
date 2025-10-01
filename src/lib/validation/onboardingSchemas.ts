import * as yup from 'yup'

// Custom validation methods
yup.addMethod(yup.string, 'deadline', function (message) {
  return this.test('deadline', message, function (value) {
    if (!value) return false
    const deadlineDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return deadlineDate > today
  })
})

// Project Details Schema
export const projectDetailsSchema = yup.object().shape({
  title: yup.string().required('Project title is required').trim(),
  category: yup.string().required('Project category is required'),
  description: yup
    .string()
    .required('Project description is required')
    .min(10, 'Project description must be at least 10 characters long')
    .trim(),
  deadline: (yup.string() as any)
    .required('Project deadline is required')
    .deadline('Project deadline must be after today'),
})

// Requirements Schema
export const requirementsSchema = yup.object().shape({
  notes: yup.string().trim(),
  files: yup.array().of(yup.mixed()),
})

// Payment Plan Schema
export const paymentPlanSchema = yup.object().shape({
  milestones: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Milestone title is required'),
      deliverable: yup.string().required('Deliverable is required'),
      deadline: yup.string().required('Milestone deadline is required'),
      amount: yup
        .number()
        .required('Amount is required')
        .positive('Amount must be positive')
        .min(1, 'Amount must be at least $1'),
    })
  ),
})

// Client Info Schema
export const clientInfoSchema = yup.object().shape({
  name: yup.string().required('Full name is required').trim(),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  company: yup.string().trim(),
  country: yup.string().required('Country is required').trim(),
})

// Complete Onboarding Schema
export const onboardingSchema = yup.object().shape({
  project: projectDetailsSchema,
  requirements: requirementsSchema,
  milestones: yup.array().min(1, 'At least one milestone is required'),
  client: clientInfoSchema,
})

// Validation helper function
export const validateStep = async (schema: yup.ObjectSchema<any>, data: any) => {
  try {
    await schema.validate(data, { abortEarly: false })
    return { isValid: true, errors: {} }
  } catch (error: any) {
    const errors: { [key: string]: string } = {}
    error.inner.forEach((err: any) => {
      errors[err.path] = err.message
    })
    return { isValid: false, errors }
  }
}

// Individual step validation functions
export const validateProjectDetails = (data: any) =>
  validateStep(projectDetailsSchema, data)

export const validateRequirements = (data: any) =>
  validateStep(requirementsSchema, data)

export const validatePaymentPlan = (data: any) =>
  validateStep(paymentPlanSchema, data)

export const validateClientInfo = (data: any) =>
  validateStep(clientInfoSchema, data)

export const validateCompleteOnboarding = (data: any) =>
  validateStep(onboardingSchema, data)