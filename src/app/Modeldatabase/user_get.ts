export interface UserResponese {
    uid:           number;
    username:      string;
    email:         string;
    password:      string;
    mobile_number: null;
    url_user:      null;
    img_user:      null;
    type:          string;
}

export interface UploadRes {

    upid:          number;
    img_car:       string;
    name_img:      string;
    detail:        string;
    uid_user:      number;
    uid:           number;
    username:      string;
    email:         string;
    password:      string;
    mobile_number: string;
    url_user:      string;
    img_user:      string;
    type:          string;
    user_fk_id:    number;
    up_fk_id:      number;
    whowon:        number;
    score:         number;
    vote_date:     Date;
    total_score: number;
}

export interface VoteRes {
    user_fk_id: number;
    up_fk_id:   number;
    whowon:     number;
    score:      number;
    vote_date:  Date;
}
