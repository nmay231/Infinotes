import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Position: IPos,
  UserRole: 'admin' | 'user' | 'guest',
  DateTime: Date,
};


export type IDraft = {
   __typename?: 'Draft',
  id: Scalars['ID'],
  note?: Maybe<INote>,
  content: Scalars['String'],
  offset: Scalars['Position'],
  user: IUser,
};

export type IMutation = {
   __typename?: 'Mutation',
  /** Notes */
  addNote: INote,
  updateNote: INote,
  deleteNote: INote,
  /** Drafts */
  noteToDraft: IDraft,
  addDraft: IDraft,
  updateDraft: IDraft,
  deleteDraft: IDraft,
};


export type IMutationAddNoteArgs = {
  content: Scalars['String'],
  offset: Scalars['Position']
};


export type IMutationUpdateNoteArgs = {
  id: Scalars['ID'],
  content?: Maybe<Scalars['String']>,
  offset?: Maybe<Scalars['Position']>
};


export type IMutationDeleteNoteArgs = {
  id: Scalars['ID']
};


export type IMutationNoteToDraftArgs = {
  noteId: Scalars['ID']
};


export type IMutationAddDraftArgs = {
  content: Scalars['String'],
  offset: Scalars['Position']
};


export type IMutationUpdateDraftArgs = {
  id: Scalars['ID'],
  content?: Maybe<Scalars['String']>,
  offset?: Maybe<Scalars['Position']>
};


export type IMutationDeleteDraftArgs = {
  id: Scalars['ID']
};

export type INote = {
   __typename?: 'Note',
  id: Scalars['ID'],
  content: Scalars['String'],
  offset: Scalars['Position'],
  user: IUser,
};


export type IQuery = {
   __typename?: 'Query',
  notes: Array<INote>,
  drafts: Array<IDraft>,
  user: IUser,
  thisUser: IUser,
};


export type IQueryNotesArgs = {
  ids?: Maybe<Array<Scalars['ID']>>
};


export type IQueryDraftsArgs = {
  ids?: Maybe<Array<Scalars['ID']>>
};


export type IQueryUserArgs = {
  id: Scalars['ID']
};

export type IUser = {
   __typename?: 'User',
  id: Scalars['ID'],
  username: Scalars['String'],
  role: Scalars['UserRole'],
  firstName: Scalars['String'],
  lastName?: Maybe<Scalars['String']>,
  fullName: Scalars['String'],
  notes: Array<INote>,
  numberOfNotes: Scalars['Int'],
  _created: Scalars['DateTime'],
};


export type ICanvasNoteDataFragment = (
  { __typename?: 'Note' }
  & Pick<INote, 'id' | 'content' | 'offset'>
  & { user: (
    { __typename?: 'User' }
    & Pick<IUser, 'id' | 'username'>
  ) }
);

export type ICanvasDraftDataFragment = (
  { __typename?: 'Draft' }
  & Pick<IDraft, 'id' | 'content' | 'offset'>
  & { note: Maybe<(
    { __typename?: 'Note' }
    & Pick<INote, 'id'>
  )> }
);

export type ICanvasNotesOnBoardQueryVariables = {
  ids?: Maybe<Array<Scalars['ID']>>
};


export type ICanvasNotesOnBoardQuery = (
  { __typename?: 'Query' }
  & { notes: Array<(
    { __typename?: 'Note' }
    & ICanvasNoteDataFragment
  )> }
);

export type ICanvasDraftsOnBoardQueryVariables = {};


export type ICanvasDraftsOnBoardQuery = (
  { __typename?: 'Query' }
  & { drafts: Array<(
    { __typename?: 'Draft' }
    & ICanvasDraftDataFragment
  )> }
);

export type ICanvasNewDraftMutationVariables = {
  content: Scalars['String'],
  offset: Scalars['Position']
};


export type ICanvasNewDraftMutation = (
  { __typename?: 'Mutation' }
  & { addDraft: (
    { __typename?: 'Draft' }
    & ICanvasDraftDataFragment
  ) }
);

export type INoteNoteToDraftMutationVariables = {
  noteId: Scalars['ID']
};


export type INoteNoteToDraftMutation = (
  { __typename?: 'Mutation' }
  & { noteToDraft: (
    { __typename?: 'Draft' }
    & Pick<IDraft, 'id' | 'content' | 'offset'>
    & { note: Maybe<(
      { __typename?: 'Note' }
      & Pick<INote, 'id'>
    )> }
  ) }
);

export type INoteDraftDraftDataFragment = (
  { __typename?: 'Draft' }
  & Pick<IDraft, 'id' | 'content' | 'offset'>
  & { note: Maybe<(
    { __typename?: 'Note' }
    & Pick<INote, 'id'>
  )> }
);

export type INoteDraftNoteDataFragment = (
  { __typename?: 'Note' }
  & Pick<INote, 'id' | 'content' | 'offset'>
  & { user: (
    { __typename?: 'User' }
    & Pick<IUser, 'id' | 'username'>
  ) }
);

export type INoteDraftUpdateDraftMutationVariables = {
  id: Scalars['ID'],
  content?: Maybe<Scalars['String']>,
  offset?: Maybe<Scalars['Position']>
};


export type INoteDraftUpdateDraftMutation = (
  { __typename?: 'Mutation' }
  & { updateDraft: (
    { __typename?: 'Draft' }
    & INoteDraftDraftDataFragment
  ) }
);

export type INoteDraftSaveDraftToExistingMutationVariables = {
  id: Scalars['ID'],
  noteId: Scalars['ID'],
  content: Scalars['String'],
  offset: Scalars['Position']
};


export type INoteDraftSaveDraftToExistingMutation = (
  { __typename?: 'Mutation' }
  & { deleteDraft: (
    { __typename?: 'Draft' }
    & INoteDraftDraftDataFragment
  ), updateNote: (
    { __typename?: 'Note' }
    & INoteDraftNoteDataFragment
  ) }
);

export type INoteDraftSaveNewDraftMutationVariables = {
  id: Scalars['ID'],
  content: Scalars['String'],
  offset: Scalars['Position']
};


export type INoteDraftSaveNewDraftMutation = (
  { __typename?: 'Mutation' }
  & { deleteDraft: (
    { __typename?: 'Draft' }
    & INoteDraftDraftDataFragment
  ), addNote: (
    { __typename?: 'Note' }
    & INoteDraftNoteDataFragment
  ) }
);

export type INoteDraftDeleteDraftMutationVariables = {
  id: Scalars['ID']
};


export type INoteDraftDeleteDraftMutation = (
  { __typename?: 'Mutation' }
  & { deleteDraft: (
    { __typename?: 'Draft' }
    & Pick<IDraft, 'id'>
    & { note: Maybe<(
      { __typename?: 'Note' }
      & INoteDraftNoteDataFragment
    )> }
  ) }
);

export type INoteDraftDeleteNoteMutationVariables = {
  id: Scalars['ID']
};


export type INoteDraftDeleteNoteMutation = (
  { __typename?: 'Mutation' }
  & { deleteNote: (
    { __typename?: 'Note' }
    & Pick<INote, 'id'>
  ) }
);

export const CanvasNoteDataFragmentDoc = gql`
    fragment canvasNoteData on Note {
  id
  content
  offset
  user {
    id
    username
  }
}
    `;
export const CanvasDraftDataFragmentDoc = gql`
    fragment canvasDraftData on Draft {
  id
  content
  offset
  note {
    id
  }
}
    `;
export const NoteDraftDraftDataFragmentDoc = gql`
    fragment NoteDraftDraftData on Draft {
  id
  content
  offset
  note {
    id
  }
}
    `;
export const NoteDraftNoteDataFragmentDoc = gql`
    fragment NoteDraftNoteData on Note {
  id
  content
  offset
  user {
    id
    username
  }
}
    `;
export const CanvasNotesOnBoardDocument = gql`
    query canvasNotesOnBoard($ids: [ID!]) {
  notes(ids: $ids) {
    ...canvasNoteData
  }
}
    ${CanvasNoteDataFragmentDoc}`;
export function useCanvasNotesOnBoardQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICanvasNotesOnBoardQuery, ICanvasNotesOnBoardQueryVariables>) {
        return ApolloReactHooks.useQuery<ICanvasNotesOnBoardQuery, ICanvasNotesOnBoardQueryVariables>(CanvasNotesOnBoardDocument, baseOptions);
      }
export function useCanvasNotesOnBoardLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICanvasNotesOnBoardQuery, ICanvasNotesOnBoardQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICanvasNotesOnBoardQuery, ICanvasNotesOnBoardQueryVariables>(CanvasNotesOnBoardDocument, baseOptions);
        }
export type CanvasNotesOnBoardQueryHookResult = ReturnType<typeof useCanvasNotesOnBoardQuery>;
export type CanvasNotesOnBoardLazyQueryHookResult = ReturnType<typeof useCanvasNotesOnBoardLazyQuery>;
export type CanvasNotesOnBoardQueryResult = ApolloReactCommon.QueryResult<ICanvasNotesOnBoardQuery, ICanvasNotesOnBoardQueryVariables>;
export const CanvasDraftsOnBoardDocument = gql`
    query canvasDraftsOnBoard {
  drafts {
    ...canvasDraftData
  }
}
    ${CanvasDraftDataFragmentDoc}`;
export function useCanvasDraftsOnBoardQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ICanvasDraftsOnBoardQuery, ICanvasDraftsOnBoardQueryVariables>) {
        return ApolloReactHooks.useQuery<ICanvasDraftsOnBoardQuery, ICanvasDraftsOnBoardQueryVariables>(CanvasDraftsOnBoardDocument, baseOptions);
      }
export function useCanvasDraftsOnBoardLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ICanvasDraftsOnBoardQuery, ICanvasDraftsOnBoardQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ICanvasDraftsOnBoardQuery, ICanvasDraftsOnBoardQueryVariables>(CanvasDraftsOnBoardDocument, baseOptions);
        }
export type CanvasDraftsOnBoardQueryHookResult = ReturnType<typeof useCanvasDraftsOnBoardQuery>;
export type CanvasDraftsOnBoardLazyQueryHookResult = ReturnType<typeof useCanvasDraftsOnBoardLazyQuery>;
export type CanvasDraftsOnBoardQueryResult = ApolloReactCommon.QueryResult<ICanvasDraftsOnBoardQuery, ICanvasDraftsOnBoardQueryVariables>;
export const CanvasNewDraftDocument = gql`
    mutation canvasNewDraft($content: String!, $offset: Position!) {
  addDraft(content: $content, offset: $offset) {
    ...canvasDraftData
  }
}
    ${CanvasDraftDataFragmentDoc}`;
export type ICanvasNewDraftMutationFn = ApolloReactCommon.MutationFunction<ICanvasNewDraftMutation, ICanvasNewDraftMutationVariables>;
export function useCanvasNewDraftMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ICanvasNewDraftMutation, ICanvasNewDraftMutationVariables>) {
        return ApolloReactHooks.useMutation<ICanvasNewDraftMutation, ICanvasNewDraftMutationVariables>(CanvasNewDraftDocument, baseOptions);
      }
export type CanvasNewDraftMutationHookResult = ReturnType<typeof useCanvasNewDraftMutation>;
export type CanvasNewDraftMutationResult = ApolloReactCommon.MutationResult<ICanvasNewDraftMutation>;
export type CanvasNewDraftMutationOptions = ApolloReactCommon.BaseMutationOptions<ICanvasNewDraftMutation, ICanvasNewDraftMutationVariables>;
export const NoteNoteToDraftDocument = gql`
    mutation NoteNoteToDraft($noteId: ID!) {
  noteToDraft(noteId: $noteId) {
    id
    content
    offset
    note {
      id
    }
  }
}
    `;
export type INoteNoteToDraftMutationFn = ApolloReactCommon.MutationFunction<INoteNoteToDraftMutation, INoteNoteToDraftMutationVariables>;
export function useNoteNoteToDraftMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<INoteNoteToDraftMutation, INoteNoteToDraftMutationVariables>) {
        return ApolloReactHooks.useMutation<INoteNoteToDraftMutation, INoteNoteToDraftMutationVariables>(NoteNoteToDraftDocument, baseOptions);
      }
export type NoteNoteToDraftMutationHookResult = ReturnType<typeof useNoteNoteToDraftMutation>;
export type NoteNoteToDraftMutationResult = ApolloReactCommon.MutationResult<INoteNoteToDraftMutation>;
export type NoteNoteToDraftMutationOptions = ApolloReactCommon.BaseMutationOptions<INoteNoteToDraftMutation, INoteNoteToDraftMutationVariables>;
export const NoteDraftUpdateDraftDocument = gql`
    mutation NoteDraftUpdateDraft($id: ID!, $content: String, $offset: Position) {
  updateDraft(id: $id, content: $content, offset: $offset) {
    ...NoteDraftDraftData
  }
}
    ${NoteDraftDraftDataFragmentDoc}`;
export type INoteDraftUpdateDraftMutationFn = ApolloReactCommon.MutationFunction<INoteDraftUpdateDraftMutation, INoteDraftUpdateDraftMutationVariables>;
export function useNoteDraftUpdateDraftMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<INoteDraftUpdateDraftMutation, INoteDraftUpdateDraftMutationVariables>) {
        return ApolloReactHooks.useMutation<INoteDraftUpdateDraftMutation, INoteDraftUpdateDraftMutationVariables>(NoteDraftUpdateDraftDocument, baseOptions);
      }
export type NoteDraftUpdateDraftMutationHookResult = ReturnType<typeof useNoteDraftUpdateDraftMutation>;
export type NoteDraftUpdateDraftMutationResult = ApolloReactCommon.MutationResult<INoteDraftUpdateDraftMutation>;
export type NoteDraftUpdateDraftMutationOptions = ApolloReactCommon.BaseMutationOptions<INoteDraftUpdateDraftMutation, INoteDraftUpdateDraftMutationVariables>;
export const NoteDraftSaveDraftToExistingDocument = gql`
    mutation NoteDraftSaveDraftToExisting($id: ID!, $noteId: ID!, $content: String!, $offset: Position!) {
  deleteDraft(id: $id) {
    ...NoteDraftDraftData
  }
  updateNote(id: $noteId, content: $content, offset: $offset) {
    ...NoteDraftNoteData
  }
}
    ${NoteDraftDraftDataFragmentDoc}
${NoteDraftNoteDataFragmentDoc}`;
export type INoteDraftSaveDraftToExistingMutationFn = ApolloReactCommon.MutationFunction<INoteDraftSaveDraftToExistingMutation, INoteDraftSaveDraftToExistingMutationVariables>;
export function useNoteDraftSaveDraftToExistingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<INoteDraftSaveDraftToExistingMutation, INoteDraftSaveDraftToExistingMutationVariables>) {
        return ApolloReactHooks.useMutation<INoteDraftSaveDraftToExistingMutation, INoteDraftSaveDraftToExistingMutationVariables>(NoteDraftSaveDraftToExistingDocument, baseOptions);
      }
export type NoteDraftSaveDraftToExistingMutationHookResult = ReturnType<typeof useNoteDraftSaveDraftToExistingMutation>;
export type NoteDraftSaveDraftToExistingMutationResult = ApolloReactCommon.MutationResult<INoteDraftSaveDraftToExistingMutation>;
export type NoteDraftSaveDraftToExistingMutationOptions = ApolloReactCommon.BaseMutationOptions<INoteDraftSaveDraftToExistingMutation, INoteDraftSaveDraftToExistingMutationVariables>;
export const NoteDraftSaveNewDraftDocument = gql`
    mutation NoteDraftSaveNewDraft($id: ID!, $content: String!, $offset: Position!) {
  deleteDraft(id: $id) {
    ...NoteDraftDraftData
  }
  addNote(content: $content, offset: $offset) {
    ...NoteDraftNoteData
  }
}
    ${NoteDraftDraftDataFragmentDoc}
${NoteDraftNoteDataFragmentDoc}`;
export type INoteDraftSaveNewDraftMutationFn = ApolloReactCommon.MutationFunction<INoteDraftSaveNewDraftMutation, INoteDraftSaveNewDraftMutationVariables>;
export function useNoteDraftSaveNewDraftMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<INoteDraftSaveNewDraftMutation, INoteDraftSaveNewDraftMutationVariables>) {
        return ApolloReactHooks.useMutation<INoteDraftSaveNewDraftMutation, INoteDraftSaveNewDraftMutationVariables>(NoteDraftSaveNewDraftDocument, baseOptions);
      }
export type NoteDraftSaveNewDraftMutationHookResult = ReturnType<typeof useNoteDraftSaveNewDraftMutation>;
export type NoteDraftSaveNewDraftMutationResult = ApolloReactCommon.MutationResult<INoteDraftSaveNewDraftMutation>;
export type NoteDraftSaveNewDraftMutationOptions = ApolloReactCommon.BaseMutationOptions<INoteDraftSaveNewDraftMutation, INoteDraftSaveNewDraftMutationVariables>;
export const NoteDraftDeleteDraftDocument = gql`
    mutation NoteDraftDeleteDraft($id: ID!) {
  deleteDraft(id: $id) {
    id
    note {
      ...NoteDraftNoteData
    }
  }
}
    ${NoteDraftNoteDataFragmentDoc}`;
export type INoteDraftDeleteDraftMutationFn = ApolloReactCommon.MutationFunction<INoteDraftDeleteDraftMutation, INoteDraftDeleteDraftMutationVariables>;
export function useNoteDraftDeleteDraftMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<INoteDraftDeleteDraftMutation, INoteDraftDeleteDraftMutationVariables>) {
        return ApolloReactHooks.useMutation<INoteDraftDeleteDraftMutation, INoteDraftDeleteDraftMutationVariables>(NoteDraftDeleteDraftDocument, baseOptions);
      }
export type NoteDraftDeleteDraftMutationHookResult = ReturnType<typeof useNoteDraftDeleteDraftMutation>;
export type NoteDraftDeleteDraftMutationResult = ApolloReactCommon.MutationResult<INoteDraftDeleteDraftMutation>;
export type NoteDraftDeleteDraftMutationOptions = ApolloReactCommon.BaseMutationOptions<INoteDraftDeleteDraftMutation, INoteDraftDeleteDraftMutationVariables>;
export const NoteDraftDeleteNoteDocument = gql`
    mutation NoteDraftDeleteNote($id: ID!) {
  deleteNote(id: $id) {
    id
  }
}
    `;
export type INoteDraftDeleteNoteMutationFn = ApolloReactCommon.MutationFunction<INoteDraftDeleteNoteMutation, INoteDraftDeleteNoteMutationVariables>;
export function useNoteDraftDeleteNoteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<INoteDraftDeleteNoteMutation, INoteDraftDeleteNoteMutationVariables>) {
        return ApolloReactHooks.useMutation<INoteDraftDeleteNoteMutation, INoteDraftDeleteNoteMutationVariables>(NoteDraftDeleteNoteDocument, baseOptions);
      }
export type NoteDraftDeleteNoteMutationHookResult = ReturnType<typeof useNoteDraftDeleteNoteMutation>;
export type NoteDraftDeleteNoteMutationResult = ApolloReactCommon.MutationResult<INoteDraftDeleteNoteMutation>;
export type NoteDraftDeleteNoteMutationOptions = ApolloReactCommon.BaseMutationOptions<INoteDraftDeleteNoteMutation, INoteDraftDeleteNoteMutationVariables>;