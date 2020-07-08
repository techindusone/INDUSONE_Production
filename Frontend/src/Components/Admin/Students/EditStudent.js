import React, { useState } from 'react';
import { useForm } from '../../UiUtil/useForm';
import gql from 'graphql-tag';

const CREATE_ADMIN = gql`
  mutation deleteProblemStatement($id: String!) {
    deleteProblemStatement(id: $id) {
      success
    }
  }
`;

export default function EditStudent({ student, updateStudent, deleteStudent, setMode }) {
  const [values, setValues] = useForm({ ...student });
  return (
    <div class="container">
      <div class="row">
        <div
          className="blogs_header"
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: '1rem',
          }}
        >
          <a
            class="button"
            style={{ color: 'white', cursor: 'pointer' }}
            onClick={() => setMode('LIST')}
          >
            Back <i class="ti-arrow-left"></i>
          </a>
        </div>
        {/* <div className="col-lg-12 col-sm-10 col-10" data-aos="fade-up" data-aos-delay="500" style = {{ boxShadow: '0px 15px 45px -9px rgba(0,0,0,.2)',marginTop:"100px"}}>
                    <form action="" method="post" class="form-box" onSubmit={e => {
                            e.preventDefault()
                        }}>
                        <h3 class="h4 text-black mb-4">{mode === 'CREATE' ? 'Create Blog' : ' Update Blog'}</h3>
                        <div class="form-group">
                            <input type="text" style={{backgroundColor: '#F0F0F0', width: '100%',border: 0,borderBottom: '2px solid $gray',outline: 0,fontSize: '1.3rem',color: 'black',padding: '7px', paddingLeft: '0.75rem', transition: 'borderColor 0.2s'}} class="form-control" placeholder="Title" name='title' value={values.title} onChange={handleChange} />
                        </div>
                        <div class="form-group">
                            <input type="text" style = {{backgroundColor: '#F0F0F0', width: '100%',border: 0,borderBottom: '2px solid $gray',outline: 0,fontSize: '1.3rem',color: 'black', padding: '7px',paddingLeft: '0.75rem', transition: 'borderColor 0.2s'}} class="form-control" placeholder="Description" name='description' value={values.description} onChange={handleChange} />
                        </div>
                        <div style={{width: '100%', paddingBottom: '1.5vh'}}>
                            <div class="ui right labeled left icon input">
                                <i class="tags icon"></i>
                                <input type="text" placeholder="Enter tags" onChange={tagChange} value={currentTag}/>
                                <a class="ui tag label" onClick={addTag}>
                                    Add Tag
                                </a>
                            </div>
                        </div>
                        {
                            tags.length > 0 && <>{
                                tags.map((tag, index) => {
                                return <a onClick={() => removeTag(tag)} classname='hoverTag' id='hoverTag' style={{textTransform: 'uppercase', padding: '0 12px', borderRadius: '5px', boxShadow: 'none', borderWidth: '0', lineHeight: '32px', backgroundColor: '#F0F0F0', display: 'inline-block', marginRight: '10px', marginBottom: '12px', fontSize: '13px', fontWeight: 700, fontFamily: 'Montserrat', cursor: 'pointer'}}>{tag}</a>
                            })} </>
                        }
                        <div class="form-group" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2.5vh'}}>
                            <input type="submit" class="btn btn-primary btn-pill"  value={mode === 'CREATE' ? 'Create': 'Modify'}  onClick={handleSubmit} />
                        </div>
                    </form>
                </div> */}
      </div>
    </div>
  );
}
