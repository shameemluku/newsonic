import React from 'react'
import "./FooterStyles.css"

function FooterComp() {
  return (
        <div className='footer'>
           <div class="container-fluid">
                    <div class="row text-muted">
                        <div class="col-6 text-start">
                            <p class="mb-0">
                                <a class="text-muted" href="/login" target="_blank"><strong>JobX</strong></a> &copy;
                            </p>
                        </div>
                        <div class="col-6 d-flex justify-content-end">
                            <ul class="list-inline">
                                <li class="list-inline-item">
                                    <a class="text-muted" href="/" target="_blank">Support</a>
                                </li>
                                <li class="list-inline-item">
                                    <a class="text-muted" href="/" target="_blank">Privacy</a>
                                </li>
                                <li class="list-inline-item">
                                    <a class="text-muted" href="/" target="_blank">Terms</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
  )
}

export default FooterComp