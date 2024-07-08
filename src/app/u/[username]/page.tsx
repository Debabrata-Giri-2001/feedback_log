'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, RefreshCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion, useChat } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponce } from '@/types/ApiResponce';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const UserForm = () => {

  const params = useParams<{ username: string }>();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()

  const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";


  const form = useForm({
    resolver: zodResolver(messageSchema)
  });
  const messageContent = form.watch('content');

  const { isLoading: isSuggestLoading, completion, error, complete, } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });
  const fetchSuggestedMessages = async () => {
    try {
      complete('')
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  }

  const onSubmit = async (data: z.infer<typeof messageSchema | any>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-message', {
        ...data,
        username
      });
      toast({
        title: 'Success',
        description: response.data.message,
        variant: 'default'
      })
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <div className='flex flex-row space-x-4'>
            <Button
              onClick={fetchSuggestedMessages}
              className="my-4"
              disabled={isSuggestLoading}
            >
              Suggest Messages
            </Button>
            <Button
              className="my-4"
              variant="outline"
              onClick={()=>{

              }}
            >
              {true ? (
                <Plus className="h-4 w-4 rotate-45 " />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500 font-semibold text-center">Internal Error 😒</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}
export default UserForm;