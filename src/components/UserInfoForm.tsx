import { useRenderCount } from '@/hooks/useRenderCount'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClipboardPen } from 'lucide-react'
import { useAppSetUser } from '@/hooks/useAppStore'

const schema = z.object({
  firstname:   z.string().min(1, 'Required'),
  lastname:    z.string().min(1, 'Required'),
  email:       z.string().email('Invalid email'),
  phoneNumber: z.string().min(6, 'Too short'),
  address:     z.string().min(5, 'Too short'),
})

type FormValues = z.infer<typeof schema>

const EXAMPLE: FormValues = {
  firstname:   'John',
  lastname:    'Doe',
  email:       'john.doe@example.com',
  phoneNumber: '+1 234 567 8900',
  address:     '123 Main St, San Francisco, CA 94105',
}

const defaultValues: FormValues = {
  firstname: '',
  lastname: '',
  email: '',
  phoneNumber: '',
  address: '',
}

export function UserInfoForm() {
  const setUser = useAppSetUser()
  const renderCount = useRenderCount()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  function onSubmit(values: FormValues) {
    setUser(values)
  }

  return (
    <Card className="relative overflow-hidden">
      <div
        key={renderCount}
        className="pointer-events-none absolute inset-0 rounded-xl animate-[render-highlight_1s_ease-out_forwards]"
      />

      <CardHeader className="relative z-10 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClipboardPen className="size-4" />
            User Info Form
          </CardTitle>
          <Badge variant="outline" className="text-xs tabular-nums">
            ×{renderCount} renders
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl><Input placeholder="John" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 8900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => form.reset(EXAMPLE)}
              >
                Auto Fill
              </Button>
              <Button type="submit" className="flex-1">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
