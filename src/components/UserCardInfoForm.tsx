import { useAppSetUserCardInfo } from '@/hooks/useAppStore'
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
import { IdCard } from 'lucide-react'

const schema = z.object({
  bio:     z.string().min(5, 'Too short'),
  role:    z.string().min(2, 'Too short'),
  company: z.string().min(2, 'Too short'),
  website: z.string(),
})

type FormValues = z.infer<typeof schema>

const EXAMPLE: FormValues = {
  bio:     'Senior engineer building scalable web applications for 10+ years.',
  role:    'Senior Software Engineer',
  company: 'Tech Corp Inc.',
  website: 'https://johndoe.dev',
}

const defaultValues: FormValues = {
  bio: '',
  role: '',
  company: '',
  website: '',
}

export function UserCardInfoForm() {
  const setUserCardInfo = useAppSetUserCardInfo()
  const renderCount = useRenderCount()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  function onSubmit(values: FormValues) {
    setUserCardInfo(values)
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
            <IdCard className="size-4" />
            User Card Info Form
          </CardTitle>
          <Badge variant="outline" className="text-xs tabular-nums">
            ×{renderCount} renders
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Tell us about yourself..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl><Input placeholder="Software Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
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
