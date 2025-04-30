# Reactions System

The reactions system allows users to interact with deals and events by adding "tick" reactions (similar to likes or upvotes).

## Database Structure

The reactions system consists of:

1. **Tables**:
   - `reactions`: Stores user reactions to deals and events

2. **Functions**:
   - `get_reaction_count(p_item_id, p_item_type)`: Returns the count of reactions for a specific item
   - `has_user_reacted(p_user_id, p_item_id, p_item_type)`: Checks if a user has reacted to a specific item

3. **Security**:
   - Row Level Security (RLS) policies to ensure users can only add/remove their own reactions
   - Appropriate permissions for authenticated and anonymous users

## Setting Up the Reactions System

### Prerequisites

- Supabase project
- Service role key for your Supabase project

### Setup Instructions

1. **Using the Setup Script**:

   ```bash
   # JavaScript version
   npm run setup:reactions

   # TypeScript version
   npm run setup:reactions:ts
   ```

2. **Environment Variables**:

   Create a `.env` file with the following variables:

   ```
   SUPABASE_URL=https://your-project-url.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   Or set them in your environment:

   ```bash
   export SUPABASE_URL=https://your-project-url.supabase.co
   export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Manual Setup**:

   If you prefer to set up the system manually, you can run the SQL script directly in the Supabase SQL editor:

   ```sql
   -- Copy the contents of scripts/sql/setup-reactions.sql
   ```

## Using the Reactions System

### Frontend Component

The `ReactionButton` component in `src/components/ui/reaction-button.tsx` provides a ready-to-use UI for the reactions system.

```tsx
import { ReactionButton } from '@/components/ui/reaction-button';

// In your component
<ReactionButton
  itemId={deal.id}
  itemType="deal"
  showCount={true}
/>
```

### API Usage

If you need to interact with the reactions system directly:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Get reaction count
const { data: count, error: countError } = await supabase
  .rpc('get_reaction_count', {
    p_item_id: itemId,
    p_item_type: 'deal' // or 'event'
  });

// Check if user has reacted
const { data: hasReacted, error: hasReactedError } = await supabase
  .rpc('has_user_reacted', {
    p_user_id: userId,
    p_item_id: itemId,
    p_item_type: 'deal' // or 'event'
  });

// Add a reaction
const { error: addError } = await supabase
  .from('reactions')
  .insert({
    user_id: userId,
    item_id: itemId,
    item_type: 'deal', // or 'event'
    reaction_type: 'tick'
  });

// Remove a reaction
const { error: removeError } = await supabase
  .from('reactions')
  .delete()
  .eq('user_id', userId)
  .eq('item_id', itemId)
  .eq('item_type', 'deal'); // or 'event'
```

## Testing the Reactions System

You can test the reactions system using the provided test script:

```bash
npm run test:reactions
```

This script will:
1. Add a test reaction
2. Check if the reaction count is correct
3. Check if the user has reacted
4. Remove the test reaction
5. Verify the reaction was removed

## Troubleshooting

If you encounter issues with the setup script:

1. **Permission Errors**: Ensure your service role key has the necessary permissions.
2. **RPC Function Not Found**: Some Supabase instances might not have the `pgexec` RPC function. Try using the SQL editor in the Supabase dashboard to run the script manually.
3. **Existing Objects**: If you already have some of the objects (tables, functions), the script will skip creating them and update only what's needed.

## Extending the System

The reactions system can be extended in several ways:

1. **Additional Reaction Types**: Modify the `reaction_type` column to support different types of reactions.
2. **Reaction Counts in Items**: Uncomment the trigger section in the SQL script to automatically update reaction counts in the deals and events tables.
3. **Analytics**: Track reaction events in the analytics table for insights into user engagement.
