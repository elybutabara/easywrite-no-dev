<?php

namespace App\Repositories\Api;

use App\Jobs\UpdateAddressJob;
use App\Models\Author;
use App\Models\Book;
use App\Models\BookReaderInvitation;
use App\Models\BookScene;
use App\Models\Chapter;
use App\Models\Notification;
use App\Models\Notification as BookInvitation;
use App\Models\NotificationMessage;
use App\Models\QueryDecision;
use App\Models\User;
use App\Notifications\SendNotification;
use App\Repositories\BaseRepository;
use App\Repositories\Frontend\PageRepository;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Auth;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class NotificationRepository extends BaseRepository
{
    /**
     * NotificationItemRepository constructor.
     * @param Notification|null $model
     */

    public function __construct(Notification $model)
    {
        parent::__construct($model);
    }

    /**
     * Create/update notification
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function save(Request $request) {
        $data = $request->except('_token');
        $notifications_item = $request->id ? $this->update($request->id, $data) : $this->create($data);
        $notifications_item->item;
        return $notifications_item;
    }

    public function getAll()
    {
        $bookPreviews = [];

        $notifications = $this->getNotificationsMessageCenter();
        $invitations = $this->getInvitationsMessageCenter();
//        $bookPreviews = [];
//        if (\request()->has('book_prev')) {
//            $pageRepository = new PageRepository();
//            $readerInvitation = $pageRepository->invitationLink(\request()->get('book_prev'));
//            if ($readerInvitation) {
//                $bookPreviews = Book::with('author')->find($readerInvitation->book_id);;
//            }
//        }

        return response()->json([ 'invitations' => $invitations,'notifications' => $notifications, 'bookPreviews' => $bookPreviews ]);
    }

    public function updateNotificationStatus(Request $request)
    {
        $notification = $this->model->find($request->id);
        $notification->update([
          'status' => 1
        ]);
        return $this->getNotificationsMessageCenter();
    }

    public function getInvitations()
    {
        $model = new BookInvitation;
        return $model
            ->where('to',Auth::User()->author->id)
            ->where('status',0)
            ->whereIn('type', ['book','book_re_read','book_invite_decision','book_reader'])
            ->where('action', 'invite')
            ->orderBy("created_at", "desc")
            ->get();
    }

    private function getInvitationsMessageCenter(){
        $invitations = $this->getInvitations();

        return $invitations->map(function($data){
            $book = Book::with('author')->find($data->book_id);
            $author = Author::find($data->from);
            $alias = ($author && $author->alias)?$author->alias:trans('Anonymous').$author->id;
            $data->alias = $alias;
            $bookReaderInvitation = BookReaderInvitation::where('email', Auth()->User()->email)->where('book_id', $data->book_id)->first();

            if($data->parent_name && $data->parent_name=='book_reader_invitations') {
                $bookReaderInvitation = BookReaderInvitation::find($data->parent_id);
            }

            /*BOOK INVITE ACCEPT & DECLINED*/
            if(in_array($data->type,['book_re_read','book_invite_decision','book','book_reader']) && $bookReaderInvitation)
            {
//                $data->message = trans('site.notifications.has-invited-you-to-read');
//                $data->message = $this->makeReplacements($message,
//                    [
//                        '_ALIAS_'=> '<a href=\'/author-reader-profile/'.$author->id.'\'>'. $data->alias .'</a>',
//                        '_BOOK_'  =>  '<a href=\'javascript:void(0)\'><b>'. $book->title .'</b></a>'
//                    ]);
                $data->book = $book;
                $data->invitation_id = $bookReaderInvitation->id;
                $data->token = $bookReaderInvitation->token;
//                $data->action = [
//                    'url' => url('/invitation'),
//                    'token' => $bookReaderInvitation->token,
//                    'invitation_id' => $bookReaderInvitation->id,
//                    'book_id' => $book->id
//                ];
                return $data;
            }else{
                $data->book = $book;
                return $data;
            }
//            return [
//                'user' => Auth::User(),
//                'url' => url('/invitation'),
//                'title' => $book->title,
//                'token' => $bookReaderInvitation->token,
//                'status' => $query->status,
//                'sender' => $author->alias,
//                'sender_author_id' => $author->id,
//                'type' => $query->type,
//                'invitation_id' => $bookReaderInvitation->id,
//                'book' => $book
//            ];
        });
    }

    public function getNotifications($status = null)
    {
        $model = new Notification();
        /*
         * REFACTORED
         * reader = reader-directory
         * reader - notify = personalize-notification - notify
         * */
        $notificationType = ['feedback','personalize-notification','reader-directory','book', 'book-directory','book_invite_decision','notif','chapter_comment', 'scene_comment'];

        if(!is_null($status)) $model->where('status', $status);
        return $model
            ->where('to',Auth::User()->author->id)
            ->whereIn('type', $notificationType)
            ->whereNotIn('action',['invite'])
            ->orderBy("created_at", "desc")->get();
    }

    private function getNotificationsMessageCenter()
    {
        $notifications = $this->getNotifications();

        return $notifications->map(function($data){
            $author = Author::find($data->from);
            $alias = ($author && $author->alias)?$author->alias:trans('Anonymous').$author->id;
            $data->alias = $alias;

            /*BOOK QUERY AND INVITATION*/
            if($data->type === 'book' && in_array($data->action,['query','invitation']))
            {
                // $book = Book::with('author')->find($data->book_id);
                if($data->parent_name === 'book') {
                    $data->book = Book::with('author')->find($data->parent_id);
                }
                else if($data->parent_name === 'book_reader_invitations') {
                    $book_reader_inv = BookReaderInvitation::with('book')->find($data->parent_id);
                    $data->book = $book_reader_inv->book;

                    if($data->from === $data->to) {
                        $data->alias = $book_reader_inv->email;
                    }
                }else{
                    $book = Book::with('author')->find($data->book_id);
                    $data->book = $book;
                }

                $data->author = $author;
                return $data;
            }
            /*BOOK INVITE ACCEPT & DECLINED*/
            else if($data->type === 'book_invite_decision' && in_array($data->action,['accept','declined']))
            {
                $book = Book::with('author')->find($data->book_id);
                $data->book = $book;
                return $data;
            }
            if($data->type === 'feedback' && $data->action == 'post' || $data->action === 'response')
            {
                $book = Book::with('author')->find($data->book_id);
                $chapter = Chapter::with(['versions','book'])->find($data->chapter_id);
                if(!$book && $chapter) {
                    $book = $chapter->book;
                }

                if($data->parent_id && $data->parent_name){
                    $data->scene = BookScene::with('book')->find($data->parent_id);
                    $chapter = Chapter::with(['versions','book'])->find($data->scene->chapter_id);
                }
                $data->book = $book;
                $data->chapter = $chapter;

                return $data;
            }
            else if($data->type === 'feedback' && $data->action === 'inlined' )
            {
                $book = Book::with('author')->find($data->book_id);
                $chapter = Chapter::find($data->chapter_id);
                if(!$book && $chapter) {
                    $book = $chapter->book;
                }

                $data->book = $book;
                $data->chapter = $chapter;
                if (empty($chapter)) return null;

                $data->message = $this->makeReplacements(trans('site.sendemail.feedback-msg'),
                        [
                            ':book_title' => $book->title,
                            ':sender' => $alias,
                            ':url' => '/my-books/chapter/'.$data->chapter_version_id,
                            ':chapter_title' => $chapter->title
                        ]);
                return $data;
//                $model = new Author;
//                $user = $model->find($data->from)->user;
//                $chapter = Chapter::find($data->chapter_id);
//
//                return [
//                    'user' => Auth()->User(),
//                    'sender' => $user->author,
//                    'chapter' => $chapter,
//                    'book_title' => $chapter->book->title,
//                    'chapter_version_id' => $data->chapter_version_id,
//                    'status' => $data->status,
//                    'type' => $data->type,
//                    'action' => $data->action
//                ];
            }
            /*NOTIF RESPONSE - PRIVATE MESSAGE*/
            else if($data->type === 'notif' && $data->action === 'response' )
            {
                $data->message = $alias . ' '
                    . trans('site.sent-you-a-message')
                    .' <a target="_blank" href=\'/private-messages\'><strong>'. trans('site.sendmail.click-here') .'</strong></a>';
                return $data;
//                $model = new Author;
//                $user = $model->find($data->from)->user;
//                $chapter = Chapter::find($data->chapter_id);
//
//                return [
//                    'user' => Auth()->User(),
//                    'sender' => $user->author,
//                    'type' => $data->type,
//                    'action' => $data->action,
//                    'status' => $data->status,
//                ];
            }
            /*READER QUERY & NOTIFY*/
            else if($data->type === 'reader-directory')
            {
                if($data->action == 'query')
                {
                    $book = Book::with('author')->find($data->book_id);
                    $data->book = $book;
                  $data->author = $author;
                    $data->message = $this->makeReplacements(trans('site.sendmail.reader-query'),
                                    [
                                        ':sender' => $alias,
                                        ':book_title' => '<a target="_blank" href=\'/the-reader-directory/4\' class=\'no-underline font-weight-bold\'>'. $book->title . '</a>'
                                    ]);
                }else if($data->action == 'reader-decision'){
                    $book = Book::with('author')->find($data->book_id);
                    $data->book = $book;
                    $data->author = $author;
                    $bookInvitation = BookReaderInvitation::with('book.author')->find($data->parent_id);
                    $queryDecision = QueryDecision::where('book_reader_invitation_id',$data->parent_id)->first();
                    if($bookInvitation->status === 1){
                        $decision = 'accepted';
                    }else if($bookInvitation->status === 2){
                        $decision = 'declined';
                    }else if($bookInvitation->status === 3){
                        $decision = 'accept-later';
                    }else{
                        $decision = 'not-sure';
                    }
                    $data->decision = $decision;
                    $data->letter = ($queryDecision) ? $queryDecision->decision : null;
                }else{
                    $book = Book::with('author')->find($data->book_id);
                    $data->book = $book;
                    $data->author = $author;
                }
                return $data;
            }
            else if ($data->type === 'personalize-notification' && $data->action == 'notify'){
                $message = $data->message['message'];
                unset($data->message);
                $data->message = $message;
                return $data;
            }
            else if($data->type === 'book-directory' && $data->action=='query')
            {
                $book = Book::with('author')->find($data->book_id);
                $data->book = $book;
                $data->author = $author;
                return $data;
            }
            else if($data->type === 'chapter_comment' && $data->action == 'post')
            {
                $book = Book::with('author')->find($data->book_id);
                $chapter = Chapter::find($data->parent_id);
                $data->book = $book;
                $data->chapter = $chapter;
                $data->author = $author;
                return $data;
            }
            else if($data->type === 'scene_comment' && $data->action == 'post')
            {
                $book = Book::with('author')->find($data->book_id);
                $scene = BookScene::find($data->parent_id);

                $data->book = $book;
                $data->scene = $scene;
                $data->author = $author;

                if (is_numeric($scene->chapter_id)) {
                    $chapter = Chapter::find($scene->chapter_id);
                    $data->chapter = $scene;
                }

                
                return $data;
            }
            else {
                $book = Book::with('author')->find($data->book_id);
                $data->book = $book;
                $data->author = $author;
                return $data;
            }
        });
    }

    /**
     * DUPLICATE
     * * TODO: REMOVE THIS IF all changeable variables is change to :_KEY_ , some are just _KEY_ no colon
     * Make the place-holder replacements on a line.
     *
     * @param  string  $line
     * @param  array   $replace
     * @return string
     */
    protected function makeReplacements($line, array $replace)
    {
        if (empty($replace)) {
            return $line;
        }

        $replace = $this->sortReplacements($replace);

        foreach ($replace as $key => $value) {
            $line = str_replace(
//                [':'.$key, ':'.Str::upper($key), ':'.Str::ucfirst($key)],
                [$key, Str::upper($key),Str::ucfirst($key)],
                [$value, Str::upper($value), Str::ucfirst($value)],
                $line
            );
        }

        return $line;
    }

    /**
     * DUPLICATE
     * TODO: REMOVE THIS IF all changeable variables is change to :_KEY_ , some are just _KEY_ no colon
     * Sort the replacements array.
     *
     * @param  array  $replace
     * @return array
     */
    protected function sortReplacements(array $replace)
    {
        return (new Collection($replace))->sortBy(function ($value, $key) {
            return mb_strlen($key) * -1;
        })->all();
    }

    public function getAdditionalNotificationData($notification)
    {
        $author = Auth::User()->author;
        $book = Book::with('author')->find($notification->book_id);
        $alias = ($author && $author->alias)?$author->alias:trans('Anonymous').$author->id;
        $notification->alias = $alias;
        $notification->author = $author;

        $chapter = ($notification->chapter_id) ? Chapter::with(['versions','book'])->find($notification->chapter_id) : null;
        if(!$book && $chapter) {
            $book = $chapter->book;
        }

        //TODO: refactor chapter and book , move it to parent_name and parent_id
        if ($notification->parent_name == 'scene'){
            $scene = BookScene::with(['book','latestVersion'])->find($notification->parent_id);
            $chapter = Chapter::with(['versions','book'])->find($scene->chapter_id);
            $notification->scene = $scene;
        }

        if(in_array($notification->type,['book_invite_decision','book','book_reader']))
        {
            $receiver = Author::find($notification->to);
            $bookReaderInvitation = BookReaderInvitation::where('email', $receiver->user->email)
                ->where('book_id', $book->id)->first();

            if ($bookReaderInvitation) {
                $notification->invitation_id = $bookReaderInvitation->id;
                $notification->token = $bookReaderInvitation->token;
            }
        }

        $notification->book = $book;
        $notification->chapter = $chapter;

        return $notification;
    }

    public function sendPesonalizeNotification(Request $request)
    {
        DB::beginTransaction();
        $notification = Notification::Create([
            'from'      => Auth::User()->author->id,
            'to'        => $request->receiver_id,
            'book_id'   => $request->book_id,
            'type'      => 'personalize-notification',
            'action'    => 'notify',
            'status'    => 0
        ]);

        //attach some additional model data need to attached in notification
        //book,chapter,alias
        $notification = $this->getAdditionalNotificationData($notification);

        NotificationMessage::Create([
            'notification_id' => $notification->id,
            'message' => $request->message
        ]);

        $notification->message = $request->message;

        \Notification::send(
            Auth()->user(),
            new SendNotification([
                'event'     => 'new_notification',
                'notification' => $notification
            ])
        );

        DB::commit();
        return response()->json(['success'=>true,'message' => trans('site.success')]);
    }
}
