import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateDirectMessage } from './CreateDirectMessage';
import { CreateGroupChat } from './CreateGroupChat';

export const NewChatDialog = () => {
  const [open, setOpen] = useState(false);

  function handleSuccess() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className='w-full'>
            <Plus />
            <span>New Chat</span>
          </Button>
        </DialogTrigger>
      </form>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>Start a new chat with a user.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='dm' className='w-full'>
          <div className='px-6'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='dm'>Direct Message</TabsTrigger>
              <TabsTrigger value='group'>Group Chat</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='dm'>
            <CreateDirectMessage />
          </TabsContent>
          <TabsContent value='group'>
            <CreateGroupChat onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
