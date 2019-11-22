import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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


export type Draft = {
   __typename?: 'Draft',
  id: Scalars['ID'],
  note?: Maybe<Note>,
  content: Scalars['String'],
  offset: Scalars['Position'],
  user: User,
};

export type Mutation = {
   __typename?: 'Mutation',
  addNote: Note,
  editNote: Note,
  deleteNote?: Maybe<Note>,
  noteToDraft: Draft,
  newDraft: Draft,
  updateDraft: Draft,
  deleteDraft?: Maybe<Note>,
};


export type MutationAddNoteArgs = {
  content: Scalars['String'],
  offset: Scalars['Position']
};


export type MutationEditNoteArgs = {
  id: Scalars['ID'],
  content?: Maybe<Scalars['String']>,
  offset?: Maybe<Scalars['Position']>
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']
};


export type MutationNoteToDraftArgs = {
  noteId: Scalars['ID']
};


export type MutationNewDraftArgs = {
  content: Scalars['String'],
  offset: Scalars['Position']
};


export type MutationUpdateDraftArgs = {
  id: Scalars['ID'],
  content?: Maybe<Scalars['String']>,
  offset?: Maybe<Scalars['Position']>
};


export type MutationDeleteDraftArgs = {
  id: Scalars['ID'],
  saveToNote: Scalars['Boolean']
};

export type Note = {
   __typename?: 'Note',
  id: Scalars['ID'],
  content: Scalars['String'],
  offset: Scalars['Position'],
  user: User,
};


export type Query = {
   __typename?: 'Query',
  note: Note,
  notes: Array<Note>,
  user: User,
  thisUser: User,
  draft: Draft,
  drafts: Array<Draft>,
};


export type QueryNoteArgs = {
  id: Scalars['ID']
};


export type QueryNotesArgs = {
  ids?: Maybe<Array<Scalars['ID']>>
};


export type QueryUserArgs = {
  id: Scalars['ID']
};


export type QueryDraftArgs = {
  id: Scalars['ID']
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  username: Scalars['String'],
  role: Scalars['UserRole'],
  firstName: Scalars['String'],
  lastName?: Maybe<Scalars['String']>,
  fullName: Scalars['String'],
  notes: Array<Note>,
  numberOfNotes: Scalars['Int'],
  _created: Scalars['DateTime'],
};




export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Note: ResolverTypeWrapper<Note>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Position: ResolverTypeWrapper<Scalars['Position']>,
  User: ResolverTypeWrapper<User>,
  UserRole: ResolverTypeWrapper<Scalars['UserRole']>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  Draft: ResolverTypeWrapper<Draft>,
  Mutation: ResolverTypeWrapper<{}>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  ID: Scalars['ID'],
  Note: Note,
  String: Scalars['String'],
  Position: Scalars['Position'],
  User: User,
  UserRole: Scalars['UserRole'],
  Int: Scalars['Int'],
  DateTime: Scalars['DateTime'],
  Draft: Draft,
  Mutation: {},
  Boolean: Scalars['Boolean'],
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type DraftResolvers<ContextType = {user: DB.User}, ParentType extends ResolversParentTypes['Draft'] = ResolversParentTypes['Draft']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  note?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType>,
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  offset?: Resolver<ResolversTypes['Position'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
};

export type MutationResolvers<ContextType = {user: DB.User}, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationAddNoteArgs, 'content' | 'offset'>>,
  editNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationEditNoteArgs, 'id'>>,
  deleteNote?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<MutationDeleteNoteArgs, 'id'>>,
  noteToDraft?: Resolver<ResolversTypes['Draft'], ParentType, ContextType, RequireFields<MutationNoteToDraftArgs, 'noteId'>>,
  newDraft?: Resolver<ResolversTypes['Draft'], ParentType, ContextType, RequireFields<MutationNewDraftArgs, 'content' | 'offset'>>,
  updateDraft?: Resolver<ResolversTypes['Draft'], ParentType, ContextType, RequireFields<MutationUpdateDraftArgs, 'id'>>,
  deleteDraft?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<MutationDeleteDraftArgs, 'id' | 'saveToNote'>>,
};

export type NoteResolvers<ContextType = {user: DB.User}, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  offset?: Resolver<ResolversTypes['Position'], ParentType, ContextType>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
};

export interface PositionScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Position'], any> {
  name: 'Position'
}

export type QueryResolvers<ContextType = {user: DB.User}, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  note?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<QueryNoteArgs, 'id'>>,
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType, QueryNotesArgs>,
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>,
  thisUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>,
  draft?: Resolver<ResolversTypes['Draft'], ParentType, ContextType, RequireFields<QueryDraftArgs, 'id'>>,
  drafts?: Resolver<Array<ResolversTypes['Draft']>, ParentType, ContextType>,
};

export type UserResolvers<ContextType = {user: DB.User}, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>,
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>,
  numberOfNotes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  _created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
};

export interface UserRoleScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UserRole'], any> {
  name: 'UserRole'
}

export type Resolvers<ContextType = {user: DB.User}> = {
  DateTime?: GraphQLScalarType,
  Draft?: DraftResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Note?: NoteResolvers<ContextType>,
  Position?: GraphQLScalarType,
  Query?: QueryResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
  UserRole?: GraphQLScalarType,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = {user: DB.User}> = Resolvers<ContextType>;


      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": []
  }
};
      export default result;
    